import { format } from "date-fns";
import type { DashboardData } from "./types";

function parseCalendarDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** Builds a plain text, Slack-ready digest of today's updates. */
export function buildDigestText(data: DashboardData, todayStr: string, title: string): string {
  const dateLabel = format(parseCalendarDate(todayStr), "EEEE d MMMM yyyy");
  const header = `${title}, ${dateLabel}`;

  let totalActive = 0;
  let updatedToday = 0;
  const trackBlocks: string[] = [];

  for (const track of data.tracks) {
    if (track.isArchived) continue;
    const workstreamLines: string[] = [];

    for (const section of track.sections) {
      if (section.isArchived) continue;
      for (const ws of section.workstreams) {
        if (ws.isArchived) continue;
        totalActive += 1;

        const todayUpdate = ws.updates.find((u) => u.updateDate === todayStr);
        if (todayUpdate) {
          updatedToday += 1;
          const statusLabel = ws.status ? ws.status.label : "No status";
          workstreamLines.push(`  ${ws.name} [${statusLabel}]`);
          workstreamLines.push(`  ${todayUpdate.body}`);
        }
      }
    }

    if (workstreamLines.length > 0) {
      trackBlocks.push([track.name, ...workstreamLines].join("\n"));
    }
  }

  const countLine = `${updatedToday} of ${totalActive} workstreams updated today`;
  const parts = [`${header}\n${countLine}`];
  if (trackBlocks.length > 0) {
    parts.push(trackBlocks.join("\n\n"));
  }
  return parts.join("\n\n");
}
