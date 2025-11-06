import Docker from "dockerode";
import nodemailer from "nodemailer";

const docker = new Docker({ socketPath: "/var/run/docker.sock" });
const containerStatusMap = new Map();
let hasSentInitialReport = false;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'adaabsen@gmail.com',
    pass: 'upns wpzu whxr xbpn',
  },
});

function sendStartupReportEmail(total, list) {
  const mailOptions = {
    from: 'adaabsen@gmail.com',
    to: 'erlanggahandika73@gmail.com',
    subject: `Docker Monitoring Started — ${total} Container(s) Detected`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="border-bottom: 1px solid #ccc;">Docker Monitoring Initialized</h2>
        <p>Docker monitoring has been started successfully on:</p>
        <p><strong>${new Date().toLocaleString()}</strong></p>

        <p>Total detected containers: <strong>${total}</strong></p>

        <div style="background: #f9f9f9; border-left: 4px solid #007BFF; padding: 10px; margin-top: 10px;">
          <h4 style="margin: 0 0 10px;">Container Status List:</h4>
          <pre style="margin: 0; font-size: 14px;">${list}</pre>
        </div>

        <p style="margin-top: 20px;">This is an automated message from the Docker Monitoring Service.</p>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error("Startup email error:", err);
    else console.log("Startup report sent:", info.response);
  });
}



function sendCrashEmail(containerName, reason) {
  const mailOptions = {
    from: 'adaabsen@gmail.com',
    to: 'erlanggahandika73@gmail.com',
    subject: `Docker Alert — Container "${containerName}" Crashed`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="border-bottom: 1px solid #d9534f; color: #d9534f;">Container Crash Detected</h2>
        <p>The following container has crashed and is no longer running:</p>

        <table style="border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ccc;"><strong>Container</strong></td>
            <td style="padding: 8px; border: 1px solid #ccc;">${containerName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ccc;"><strong>Reason</strong></td>
            <td style="padding: 8px; border: 1px solid #ccc;">${reason}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ccc;"><strong>Time</strong></td>
            <td style="padding: 8px; border: 1px solid #ccc;">${new Date().toLocaleString()}</td>
          </tr>
        </table>

        <p style="margin-top: 20px;">Please investigate the issue promptly to ensure service stability.</p>
        <p style="font-size: 12px; color: #888;">This message was sent automatically by the Docker Monitoring Service.</p>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error("Crash email error:", err);
    else console.log(`Crash email sent for ${containerName}: ${info.response}`);
  });
}


export function startMonitoring(interval = 10000) {
  setInterval(async () => {
    try {
      const containers = await docker.listContainers({ all: true });
      const startupStatusList = [];

      for (const c of containers) {
        const container = docker.getContainer(c.Id);
        const inspect = await container.inspect();

        const name = c.Names[0]?.replace("/", "");
        const currentStatus = inspect.State?.Status;
        const prevStatus = containerStatusMap.get(c.Id);

        if (!hasSentInitialReport) {
          startupStatusList.push(`- ${name}: ${currentStatus}`);
        }

        if (prevStatus === "running" && currentStatus === "exited") {
          sendCrashEmail(name, inspect.State?.Error || "Exited unexpectedly");
        }

        containerStatusMap.set(c.Id, currentStatus);
      }

      if (!hasSentInitialReport) {
        sendStartupReportEmail(startupStatusList.length, startupStatusList.join("\n"));
        hasSentInitialReport = true;
      }
    } catch (err) {
      console.error("❗ Polling error:", err);
    }
  }, interval);
}
