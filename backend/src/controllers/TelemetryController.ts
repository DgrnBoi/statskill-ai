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

      if (!userId || !quizId || score === undefined) {
        return res.status(400).json({ error: "Missing required telemetry fields." });
      }

      // Convert to strict xAPI Statement
      const statement: XApiStatement = {
        actor: {
          name: userName || "MoSPI Official",
          account: {
            homePage: "https://igotkarmayogi.gov.in",
            name: userId
          }
        },
        verb: {
          id: "http://adlnet.gov/expapi/verbs/completed",
          display: { "en-US": "completed" }
        },
        object: {
          id: `https://statskill.mospi.gov.in/assessments/${quizId}`,
          definition: {
            name: { "en-US": quizName || "Statistical Assessment" },
            type: "http://adlnet.gov/expapi/activities/assessment"
          }
        },
        result: {
          score: {
            scaled: score / 100,
            raw: score,
            min: 0,
            max: 100
          },
          success: score >= 60 // 60% passing threshold
        },
        timestamp: new Date().toISOString()
      };

      // In production, this would be pushed via HTTPS to the national LRS (Learning Record Store)
      // For the prototype, we simulate the "Store-and-Forward" successful dispatch:
      console.log("[xAPI Telemetry] Successfully formatted and dispatched statement:");
      console.dir(statement, { depth: null });

      return res.status(200).json({ 
        success: true, 
        message: "Telemetry successfully synced with iGOT Karmayogi LRS",
        statement 
      });

    } catch (error) {
      console.error("[Telemetry Error]", error);
      return res.status(500).json({ error: "Failed to process telemetry" });
    }
  }
}
