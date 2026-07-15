export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json; charset=utf-8"
    };
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    const url = new URL(request.url);
    if (url.pathname === "/health") return Response.json({ ok: true }, { headers: cors });
    if (request.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405, headers: cors });
    if (!env.ANTHROPIC_API_KEY || !env.ANTHROPIC_MODEL) return Response.json({ error: "Server ist nicht vollständig konfiguriert." }, { status: 500, headers: cors });

    try {
      const body = await request.json();
      const entry = String(body.entry || "").trim().slice(0, 12000);
      if (entry.length < 20) return Response.json({ error: "Eintrag ist zu kurz." }, { status: 400, headers: cors });
      const prompt = `Analysiere den folgenden privaten Journaleintrag ausschließlich zur behutsamen Selbstreflexion. Keine Diagnose, keine Therapieanweisung. Schreibe auf Deutsch, warm, konkret und nicht klinisch. Antworte ausschließlich als valides JSON ohne Markdown mit diesen Feldern: summary (3-5 Sätze), emotions (Array mit 1-4 möglichen Gefühlen, vorsichtig formuliert), patterns (Array mit 1-4 möglichen Mustern oder Bedürfnissen), question (eine offene, sanfte Reflexionsfrage). Stelle Vermutungen als Möglichkeiten dar.\n\nCheck-in: ${JSON.stringify(body.checkin || {})}\n\nJournaleintrag:\n${entry}`;
      const apiResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({ model: env.ANTHROPIC_MODEL, max_tokens: 900, messages: [{ role: "user", content: prompt }] })
      });
      if (!apiResponse.ok) return Response.json({ error: "KI-Anbieter antwortete mit einem Fehler." }, { status: 502, headers: cors });
      const apiData = await apiResponse.json();
      const text = apiData?.content?.find(part => part.type === "text")?.text || "";
      const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      const result = JSON.parse(cleaned);
      return Response.json({
        summary: String(result.summary || ""),
        emotions: Array.isArray(result.emotions) ? result.emotions.map(String).slice(0,5) : [],
        patterns: Array.isArray(result.patterns) ? result.patterns.map(String).slice(0,5) : [],
        question: String(result.question || "")
      }, { headers: cors });
    } catch (error) {
      return Response.json({ error: "Auswertung fehlgeschlagen." }, { status: 500, headers: cors });
    }
  }
};
