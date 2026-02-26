import { NextRequest, NextResponse } from "next/server";
import { getEmailQueue, getEmailStats, clearOldEmailLogs } from "@/lib/brevo";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const clearHours = searchParams.get('clearHours');

    // Clear old logs if requested
    if (action === 'clear' && clearHours) {
      const hours = parseInt(clearHours, 10);
      if (!isNaN(hours) && hours > 0) {
        clearOldEmailLogs(hours);
        console.log(`🧹 Cleared email logs older than ${hours} hours`);
      }
    }

    const stats = getEmailStats();
    const queue = getEmailQueue();

    return NextResponse.json({
      success: true,
      stats,
      queue: queue.map(log => ({
        id: log.id,
        to: log.to,
        subject: log.subject,
        status: log.status,
        attempts: log.attempts,
        lastAttempt: log.lastAttempt,
        errorMessage: log.errorMessage,
        messageId: log.messageId
      })),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ Email monitoring error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
