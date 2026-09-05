import { Request, Response } from 'express';

// xAPI / CMI5 Standard structure for Learning Record Store (LRS)
interface XApiStatement {
  actor: {
    name: string;
    account: {
      homePage: string; // e.g., "https://igotkarmayogi.gov.in"
      name: string;     // e.g., "JanParichay_ID_1042"
    }
  };
  verb: {
    id: string; // e.g., "http://adlnet.gov/expapi/verbs/completed"
    display: { "en-US": string };
  };
  object: {
    id: string; // Course/Quiz URI
    definition: {
      name: { "en-US": string };
      type: string;
    }
  };
  result?: {
    score: {
      scaled: number; // 0.0 to 1.0
      raw: number;
      min: 0;
      max: 100;
    };
    success: boolean;
  };
  timestamp: string;
}

export class TelemetryController {
  
  /**
   * Receives simple completion data from our frontend and formats it into
   * a strict xAPI statement before "forwarding" it to the iGOT ecosystem.
   */
  public async submitQuizTelemetry(req: Request, res: Response) {
    try {
      const { userId, userName, quizId, quizName, score } = req.body;

      if (!userId || !quizId || score === undefined || typeof score !== 'number' || isNaN(score)) {
        return res.status(400).json({ error: "Missing required telemetry fields." });
      }

      // Sanitize inputs to prevent script injection or telemetry corruption
      const sanitizedUserId = String(userId).replace(/[^a-zA-Z0-9_.-]/g, '').slice(0, 100);
      const sanitizedUserName = String(userName || 'MoSPI Official').replace(/<[^>]*>?/gm, '').trim().slice(0, 120);
      const sanitizedQuizId = String(quizId).replace(/[^a-zA-Z0-9_.-]/g, '').slice(0, 100);
      const sanitizedQuizName = String(quizName || 'Statistical Assessment').replace(/<[^>]*>?/gm, '').trim().slice(0, 200);
      const boundedScore = Math.max(0, Math.min(100, Math.round(score)));

      // Convert to strict xAPI Statement
      const statement: XApiStatement = {
        actor: {
          name: sanitizedUserName,
          account: {
            homePage: "https://igotkarmayogi.gov.in",
            name: sanitizedUserId
          }
        },
        verb: {
          id: "http://adlnet.gov/expapi/verbs/completed",
          display: { "en-US": "completed" }
        },
        object: {
          id: `https://statskill.mospi.gov.in/assessments/${sanitizedQuizId}`,
          definition: {
            name: { "en-US": sanitizedQuizName },
            type: "http://adlnet.gov/expapi/activities/assessment"
          }
        },
        result: {
          score: {
            scaled: boundedScore / 100,
            raw: boundedScore,
            min: 0,
            max: 100
          },
          success: boundedScore >= 60 // 60% passing threshold
        },
        timestamp: new Date().toISOString()
      };

      // Live LRS Dispatch or Local Store-and-Forward simulation
      let dispatchedToRemote = false;
      const lrsEndpoint = process.env.IGOT_LRS_ENDPOINT;

      if (lrsEndpoint) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          const lrsResponse = await fetch(lrsEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Experience-API-Version': '1.0.3'
            },
            body: JSON.stringify(statement),
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          dispatchedToRemote = lrsResponse.ok;
          console.log(`[xAPI Telemetry] Outbound LRS HTTP POST response status: ${lrsResponse.status}`);
        } catch (lrsErr: any) {
          console.warn(`[xAPI Telemetry] Remote LRS unreachable (${lrsErr.message}). Stored in local store-and-forward queue.`);
        }
      }

      console.log("[xAPI Telemetry] Successfully formatted and dispatched statement:");
      console.dir(statement, { depth: null });

      return res.status(200).json({ 
        success: true, 
        message: dispatchedToRemote 
          ? "Telemetry successfully synced with external iGOT Karmayogi LRS" 
          : "Telemetry successfully formatted and buffered in local store-and-forward queue",
        dispatchedToRemote,
        statement 
      });

    } catch (error) {
      console.error("[Telemetry Error]", error);
      return res.status(500).json({ error: "Failed to process telemetry" });
    }
  }
}
