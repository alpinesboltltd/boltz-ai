import { format } from "date-fns";
import {
  TimeSeriesData,
  TopQuestion,
  UserSatisfaction,
  PlatformData,
  SentimentData,
  AnalyticsMetrics,
} from "./analytics";

export interface ExportData {
  metrics: AnalyticsMetrics;
  timeline: TimeSeriesData[];
  topQuestions: TopQuestion[];
  userSatisfaction: UserSatisfaction;
  platformDistribution: (PlatformData | Omit<PlatformData, "count">)[];
  sentimentAnalysis: SentimentData[];
  conversationsByHour: number[];
}

export class AnalyticsExporter {
  static exportToCSV(
    data: ExportData,
    timeRange: string,
    agentName: string = "All Agents"
  ): void {
    const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss");
    const filename = `analytics_${agentName.replace(/\s+/g, "_")}_${timeRange}_${timestamp}.csv`;

    // Create CSV content
    let csvContent = "";

    // Add header information
    csvContent += `Analytics Report\n`;
    csvContent += `Agent: ${agentName}\n`;
    csvContent += `Time Range: ${timeRange}\n`;
    csvContent += `Generated: ${format(new Date(), "yyyy-MM-dd HH:mm:ss")}\n\n`;

    // Add metrics section
    csvContent += `METRICS\n`;
    csvContent += `Metric,Value\n`;
    csvContent += `Total Messages,${data.metrics.totalMessages}\n`;
    csvContent += `Unique Users,${data.metrics.uniqueUsers}\n`;
    csvContent += `Average Rating,${data.metrics.avgRating}\n`;
    csvContent += `Response Rate,${(data.metrics.responseRate * 100).toFixed(1)}%\n`;
    csvContent += `Conversions,${data.metrics.conversionsCount}\n`;
    csvContent += `Escalation Rate,${(data.metrics.escalationRate * 100).toFixed(1)}%\n`;
    csvContent += `Avg Session Duration,${data.metrics.avgSessionDuration} minutes\n`;
    csvContent += `Avg Response Time,${data.metrics.avgResponseTime} seconds\n\n`;

    // Add timeline data
    csvContent += `TIMELINE DATA\n`;
    csvContent += `Date,Messages,Users,Conversations\n`;
    data.timeline.forEach((item) => {
      csvContent += `${item.date},${item.messages},${item.users},${item.conversations}\n`;
    });
    csvContent += `\n`;

    // Add top questions
    csvContent += `TOP QUESTIONS\n`;
    csvContent += `Question,Count,Category\n`;
    data.topQuestions.forEach((item) => {
      csvContent += `"${item.question}",${item.count},${item.category || "N/A"}\n`;
    });
    csvContent += `\n`;

    // Add user satisfaction
    csvContent += `USER SATISFACTION\n`;
    csvContent += `Satisfaction Level,Count\n`;
    csvContent += `Satisfied,${data.userSatisfaction.satisfied}\n`;
    csvContent += `Neutral,${data.userSatisfaction.neutral}\n`;
    csvContent += `Unsatisfied,${data.userSatisfaction.unsatisfied}\n\n`;

    // Add platform distribution
    csvContent += `PLATFORM DISTRIBUTION\n`;
    csvContent += `Platform,Percentage,Count\n`;
    data.platformDistribution.forEach((item) => {
      const count = "count" in item ? (item as PlatformData).count : undefined;
      csvContent += `${item.platform},${item.percentage}%,${count ?? "N/A"}\n`;
    });
    csvContent += `\n`;

    // Add hourly data
    csvContent += `CONVERSATIONS BY HOUR\n`;
    csvContent += `Hour,Conversations\n`;
    data.conversationsByHour.forEach((count: number, hour: number) => {
      csvContent += `${hour}:00,${count}\n`;
    });

    // Download the file
    this.downloadFile(csvContent, filename, "text/csv");
  }

  static exportToJSON(
    data: ExportData,
    timeRange: string,
    agentName: string = "All Agents"
  ): void {
    const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss");
    const filename = `analytics_${agentName.replace(/\s+/g, "_")}_${timeRange}_${timestamp}.json`;

    const exportData = {
      metadata: {
        agent: agentName,
        timeRange,
        generatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        version: "1.0",
      },
      ...data,
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    this.downloadFile(jsonContent, filename, "application/json");
  }

  static generatePDFReport(
    data: ExportData,
    timeRange: string,
    agentName: string = "All Agents"
  ): void {
    // For now, we'll create a detailed HTML report that can be printed as PDF
    const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss");
    const filename = `analytics_report_${agentName.replace(/\s+/g, "_")}_${timeRange}_${timestamp}.html`;

    const htmlContent = this.generateHTMLReport(data, timeRange, agentName);
    this.downloadFile(htmlContent, filename, "text/html");
  }

  private static generateHTMLReport(
    data: ExportData,
    timeRange: string,
    agentName: string
  ): string {
    const satisfactionRateNum =
      (data.userSatisfaction.satisfied /
        (data.userSatisfaction.satisfied +
          data.userSatisfaction.neutral +
          data.userSatisfaction.unsatisfied)) *
      100;
    const satisfactionRate = satisfactionRateNum.toFixed(1);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analytics Report - ${agentName}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { border-bottom: 2px solid #3B82F6; padding-bottom: 20px; margin-bottom: 30px; }
        .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric-card { border: 1px solid #E5E7EB; padding: 15px; border-radius: 8px; }
        .metric-value { font-size: 24px; font-weight: bold; color: #3B82F6; }
        .metric-label { color: #6B7280; font-size: 14px; }
        .section { margin: 30px 0; }
        .section h2 { color: #1F2937; border-bottom: 1px solid #E5E7EB; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th, td { border: 1px solid #E5E7EB; padding: 8px 12px; text-align: left; }
        th { background-color: #F9FAFB; font-weight: 600; }
        .positive { color: #059669; }
        .warning { color: #D97706; }
        .negative { color: #DC2626; }
        @media print { body { margin: 20px; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>Analytics Report</h1>
        <p><strong>Agent:</strong> ${agentName}</p>
        <p><strong>Time Range:</strong> ${timeRange}</p>
        <p><strong>Generated:</strong> ${format(new Date(), "yyyy-MM-dd HH:mm:ss")}</p>
    </div>

    <div class="section">
        <h2>Key Metrics</h2>
        <div class="metric-grid">
            <div class="metric-card">
                <div class="metric-value">${data.metrics.totalMessages.toLocaleString()}</div>
                <div class="metric-label">Total Messages</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${data.metrics.uniqueUsers.toLocaleString()}</div>
                <div class="metric-label">Unique Users</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${data.metrics.avgRating}/5.0</div>
                <div class="metric-label">Average Rating</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${(data.metrics.responseRate * 100).toFixed(1)}%</div>
                <div class="metric-label">Response Rate</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${data.metrics.conversionsCount}</div>
                <div class="metric-label">Conversions</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${(data.metrics.escalationRate * 100).toFixed(1)}%</div>
                <div class="metric-label">Escalation Rate</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>User Satisfaction</h2>
  <p><strong>Overall Satisfaction Rate:</strong> <span class="${satisfactionRateNum > 70 ? "positive" : satisfactionRateNum > 50 ? "warning" : "negative"}">${satisfactionRate}%</span></p>
        <table>
            <tr><th>Level</th><th>Count</th><th>Percentage</th></tr>
            <tr><td>Satisfied</td><td>${data.userSatisfaction.satisfied}</td><td>${((data.userSatisfaction.satisfied / (data.userSatisfaction.satisfied + data.userSatisfaction.neutral + data.userSatisfaction.unsatisfied)) * 100).toFixed(1)}%</td></tr>
            <tr><td>Neutral</td><td>${data.userSatisfaction.neutral}</td><td>${((data.userSatisfaction.neutral / (data.userSatisfaction.satisfied + data.userSatisfaction.neutral + data.userSatisfaction.unsatisfied)) * 100).toFixed(1)}%</td></tr>
            <tr><td>Unsatisfied</td><td>${data.userSatisfaction.unsatisfied}</td><td>${((data.userSatisfaction.unsatisfied / (data.userSatisfaction.satisfied + data.userSatisfaction.neutral + data.userSatisfaction.unsatisfied)) * 100).toFixed(1)}%</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Top Questions</h2>
        <table>
            <tr><th>Question</th><th>Count</th><th>Category</th></tr>
            ${data.topQuestions
              .map(
                (q) => `
                <tr>
                    <td>${q.question}</td>
                    <td>${q.count}</td>
                    <td>${q.category || "N/A"}</td>
                </tr>
            `
              )
              .join("")}
        </table>
    </div>

    <div class="section">
        <h2>Platform Distribution</h2>
        <table>
            <tr><th>Platform</th><th>Percentage</th></tr>
            ${data.platformDistribution
              .map(
                (p) => `
                <tr>
                    <td>${p.platform}</td>
                    <td>${p.percentage}%</td>
                </tr>
            `
              )
              .join("")}
        </table>
    </div>

    <div class="section">
        <h2>Performance Summary</h2>
        <ul>
            <li><strong>Response Rate:</strong> ${data.metrics.responseRate >= 0.8 ? '<span class="positive">Excellent</span>' : data.metrics.responseRate >= 0.6 ? '<span class="warning">Good</span>' : '<span class="negative">Needs Improvement</span>'}</li>
            <li><strong>User Satisfaction:</strong> ${satisfactionRateNum >= 70 ? '<span class="positive">High</span>' : satisfactionRateNum >= 50 ? '<span class="warning">Moderate</span>' : '<span class="negative">Low</span>'}</li>
            <li><strong>Escalation Rate:</strong> ${data.metrics.escalationRate <= 0.1 ? '<span class="positive">Low</span>' : data.metrics.escalationRate <= 0.2 ? '<span class="warning">Moderate</span>' : '<span class="negative">High</span>'}</li>
        </ul>
    </div>
</body>
</html>`;
  }

  private static downloadFile(
    content: string,
    filename: string,
    mimeType: string
  ): void {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
