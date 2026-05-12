"""Inject per-project media arrays (terminal replays + code snippets) into projects.json."""
import json, sys

path = 'c:/Users/faraz/faraz projects/portfolio/data/projects.json'
data = json.load(open(path))

media = {
    "aegisscan": [
        {"type": "github", "repo": "Aegisscan"},
        {"type": "terminal", "title": "aegisscan · scan replay", "lines": [
            {"prompt": "$", "text": "aegisscan run --target acme-corp.io --depth deep", "color": "in"},
            {"text": "[i] spawning web, api, network, config scanners ...", "color": "muted"},
            {"text": "[ok] web    -> 12 findings", "color": "ok"},
            {"text": "[ok] api    -> 5  findings", "color": "ok"},
            {"text": "[ok] net    -> 9  findings", "color": "ok"},
            {"text": "[ok] config -> 7  findings", "color": "ok"},
            {"text": "[i] correlating across 33 raw findings ...", "color": "muted"},
            {"text": "[!] cluster #03  critical  origin: web+api+net", "color": "err"},
            {"text": "      exposed admin panel + IAM over-permission + open port 22", "color": "warn"},
            {"text": "      remediation: rotate keys, close 22, gate /admin behind sso", "color": "muted"},
            {"text": "[ok] 33 findings -> 8 ranked clusters", "color": "ok"},
            {"prompt": ">", "text": "report saved to ./out/aegis-acme-2026-05-12.html", "color": "muted"}
        ]},
        {"type": "code", "lang": "typescript", "filename": "src/correlator.ts", "code": "// AegisScan correlation engine\nimport { llmClassify } from './llm';\n\nexport async function correlate(findings: Finding[]) {\n  const grouped = await llmClassify(findings, {\n    instruction: 'cluster findings into a single attack story',\n    maxClusters: 12,\n  });\n  return grouped.map((c) => ({\n    severity: scoreCluster(c),\n    evidence: c.findings,\n    remediation: c.suggestion,\n  }));\n}\n\nfunction scoreCluster(c: Cluster) {\n  const base = Math.max(...c.findings.map((f) => f.cvss));\n  const corroboration = new Set(c.findings.map((f) => f.tool)).size;\n  return base * (1 + 0.15 * corroboration);\n}"}
    ],
    "real-time-threat-detection": [
        {"type": "github", "repo": "Real-time-threat-detection"},
        {"type": "terminal", "title": "soc pipeline · live tail", "lines": [
            {"prompt": "$", "text": "python pipeline.py --tail --clouds aws,azure", "color": "in"},
            {"text": "[ingest] cloudtrail   stream connected", "color": "ok"},
            {"text": "[ingest] azure-monitor stream connected", "color": "ok"},
            {"text": "[i] feature pipeline warm. 184 features per event", "color": "muted"},
            {"text": "[ok] 02:31:08  aws  s3.public.read    score 0.31  benign", "color": "muted"},
            {"text": "[ok] 02:31:09  az   iam.list           score 0.18  benign", "color": "muted"},
            {"text": "[!] 02:31:12  aws  iam.privilege.esc  score 0.94  ALERT", "color": "err"},
            {"text": "       user: svc-deploy   asset: prod-1   anomaly: 7.2 sigma", "color": "warn"},
            {"text": "[!] 02:31:14  az   audit.policy.disabled  score 0.88  ALERT", "color": "err"},
            {"text": "       linked to aws alert above. cross cloud pivot detected.", "color": "warn"},
            {"text": "[ok] alert pushed to soc queue. severity high.", "color": "ok"}
        ]},
        {"type": "code", "lang": "python", "filename": "models/score.py", "code": "import joblib\nfrom features import build_features\n\nmodel = joblib.load('models/ensemble.pkl')\n\ndef score_event(event):\n    f = build_features(event)\n    anomaly = model['anomaly'].score_samples([f])[0]\n    classify = model['classify'].predict_proba([f])[0][1]\n    final = 0.6 * normalise(anomaly) + 0.4 * classify\n    return {\n        'score': final,\n        'verdict': 'alert' if final > 0.75 else 'benign',\n        'evidence': event,\n    }"}
    ],
    "ai-security-analyst": [
        {"type": "github", "repo": "AI-security-analyst"},
        {"type": "terminal", "title": "ai analyst · agent trace", "lines": [
            {"prompt": "$", "text": "curl -X POST /analyse -d @alert.json", "color": "in"},
            {"text": "[orchestrator] dispatching to 5 agents ...", "color": "muted"},
            {"text": "[log-parser]   normalising 412 log lines       ok", "color": "ok"},
            {"text": "[anomaly]      baseline ready. 1 outlier found  ok", "color": "ok"},
            {"text": "[threat-intel] querying 4 providers ...        ok", "color": "ok"},
            {"text": "    ioc 185.117.x.x  -> known c2  vendor: feodotracker", "color": "warn"},
            {"text": "[response]     drafting containment plan ...   ok", "color": "ok"},
            {"text": "    isolate host, rotate cred, push firewall rule", "color": "muted"},
            {"text": "[report]       writing incident report ...     ok", "color": "ok"},
            {"text": "[done] response time 3.4s. report saved to incidents/IR-2026-0512.md", "color": "ok"}
        ]},
        {"type": "code", "lang": "python", "filename": "agents/orchestrator.py", "code": "import asyncio\nfrom agents import LogParser, Anomaly, ThreatIntel, Response, Reporter\n\nclass Orchestrator:\n    def __init__(self):\n        self.agents = {\n            'parse':   LogParser(),\n            'anomaly': Anomaly(),\n            'intel':   ThreatIntel(),\n            'respond': Response(),\n            'report':  Reporter(),\n        }\n\n    async def analyse(self, alert):\n        parsed = await self.agents['parse'].run(alert)\n        intel, anomaly = await asyncio.gather(\n            self.agents['intel'].run(parsed),\n            self.agents['anomaly'].run(parsed),\n        )\n        plan = await self.agents['respond'].run(parsed, intel, anomaly)\n        return await self.agents['report'].run(parsed, intel, anomaly, plan)"}
    ],
    "autonomus": [
        {"type": "github", "repo": "Autonomus"},
        {"type": "terminal", "title": "autonomus · compliance run", "lines": [
            {"prompt": "$", "text": "autonomus scan --account prod --framework cis-aws", "color": "in"},
            {"text": "[i] loading 137 policy rules from policy/", "color": "muted"},
            {"text": "[ok] cis-aws-1.1  root mfa enabled            pass", "color": "ok"},
            {"text": "[!] cis-aws-2.7  s3-prod-uploads public-read   FAIL", "color": "err"},
            {"text": "[!] cis-aws-4.2  security group 0.0.0.0/0:22   FAIL", "color": "err"},
            {"text": "[!] cis-aws-1.16 unused iam keys > 90 days     FAIL", "color": "err"},
            {"text": "[i] classified: 3 failures, 3 auto-fixable", "color": "muted"},
            {"text": "[ok] auto-fix s3-prod-uploads      bucket policy applied", "color": "ok"},
            {"text": "[ok] auto-fix sg-12ab34  ingress 0.0.0.0/0:22 removed", "color": "ok"},
            {"text": "[ok] auto-fix iam keys             3 keys deactivated", "color": "ok"},
            {"text": "[done] 3/3 fixed. audit trail -> evidence/2026-05-12.jsonl", "color": "ok"}
        ]},
        {"type": "code", "lang": "python", "filename": "rules/cis_aws_2_7.py", "code": "# CIS AWS 2.7: S3 buckets must not be publicly readable\nfrom autonomus import rule, Severity\n\n@rule(framework='cis-aws', id='2.7', severity=Severity.HIGH)\ndef s3_no_public_read(account):\n    for bucket in account.s3.buckets():\n        acl = bucket.acl()\n        if 'AllUsers' in acl.public_grants:\n            yield Violation(\n                resource=bucket.arn,\n                reason='AllUsers has read grant',\n                auto_fix=lambda: bucket.set_block_public_access(True),\n            )"}
    ],
    "etl-financial": [
        {"type": "github", "repo": "Automated-ETL-Pipeline-for-Financial-Analytics"},
        {"type": "terminal", "title": "etl · month end run", "lines": [
            {"prompt": "$", "text": "etl run --schedule month-end --year 2026 --month 05", "color": "in"},
            {"text": "[extract] vendor 01 bloomberg   2.4 GB  ok", "color": "ok"},
            {"text": "[extract] vendor 02 refinitiv   1.1 GB  ok", "color": "ok"},
            {"text": "[extract] vendor 03 sftp drop   180 MB  ok", "color": "ok"},
            {"text": "          ... 12 more sources ...", "color": "muted"},
            {"text": "[validate] schema gate  pass  / business rules  pass", "color": "ok"},
            {"text": "[transform] 18.3 M rows    elapsed 47s", "color": "ok"},
            {"text": "[validate] output gate  pass", "color": "ok"},
            {"text": "[load] warehouse fct_positions  upsert  18.3 M  ok", "color": "ok"},
            {"text": "[load] lineage recorded for 15 sources -> 1 fact table", "color": "muted"},
            {"text": "[done] elapsed 4m 12s. dashboards ready.", "color": "ok"}
        ]},
        {"type": "code", "lang": "python", "filename": "pipeline/transform.py", "code": "import pandas as pd\nfrom validation import gate\n\n@gate(schema='positions_v3', rules=['no_nulls', 'sum_balance'])\ndef transform_positions(df: pd.DataFrame) -> pd.DataFrame:\n    df = df.assign(\n        traded_at=pd.to_datetime(df['traded_at'], utc=True),\n        notional=df['qty'] * df['price'],\n    )\n    return (\n        df\n        .dropna(subset=['account_id', 'ticker'])\n        .groupby(['account_id', 'ticker', pd.Grouper(key='traded_at', freq='D')])\n        .agg(qty=('qty', 'sum'), notional=('notional', 'sum'))\n        .reset_index()\n    )"}
    ],
    "powerbi-executive": [
        {"type": "github", "repo": "Interactive-Power-BI-Executive-Dashboard"},
        {"type": "terminal", "title": "dashboard · monday refresh", "lines": [
            {"prompt": "$", "text": "pbi refresh --dataset executive --schedule monday-am", "color": "in"},
            {"text": "[warehouse] running 12 source queries ...", "color": "muted"},
            {"text": "[ok] revenue                 elapsed 1.2s", "color": "ok"},
            {"text": "[ok] customer_health         elapsed 0.9s", "color": "ok"},
            {"text": "[ok] ops_metrics             elapsed 1.6s", "color": "ok"},
            {"text": "[forecast] python forecasts written ...", "color": "muted"},
            {"text": "[ok] revenue forecast Q2     written", "color": "ok"},
            {"text": "[ok] churn forecast 30d      written", "color": "ok"},
            {"text": "[dax] recomputing 47 measures ... ok", "color": "ok"},
            {"text": "[done] dataset published. dashboard live for monday review.", "color": "ok"}
        ]},
        {"type": "code", "lang": "python", "filename": "forecast.py", "code": "import pandas as pd\nfrom sklearn.ensemble import GradientBoostingRegressor\n\ndef forecast_quarter(history: pd.DataFrame) -> pd.DataFrame:\n    X = make_features(history)\n    y = history['revenue']\n    model = GradientBoostingRegressor(n_estimators=400)\n    model.fit(X[:-90], y[:-90])\n    horizon = build_horizon(history, days=90)\n    forecast = model.predict(make_features(horizon))\n    return pd.DataFrame({\n        'date': horizon['date'],\n        'forecast': forecast,\n        'low': forecast * 0.92,\n        'high': forecast * 1.08,\n    })"}
    ],
    "churn-ml": [
        {"type": "github", "repo": "Machine-Learning-Churn-Prediction-Model"},
        {"type": "terminal", "title": "churn · daily scoring", "lines": [
            {"prompt": "$", "text": "python score_daily.py --date 2026-05-12", "color": "in"},
            {"text": "[features] building windows over 42 day history ...", "color": "muted"},
            {"text": "[features] 184,233 customers   38 features each   ok", "color": "ok"},
            {"text": "[model] loading ensemble  v2.4.1", "color": "muted"},
            {"text": "[score] elapsed 6.3s", "color": "ok"},
            {"text": "[i] segments:  low=148,221  med=24,109  high=11,903", "color": "muted"},
            {"text": "[crm] firing 11,903 retention triggers to hubspot ...", "color": "warn"},
            {"text": "[ok] 11,896 / 11,903 triggers acknowledged", "color": "ok"},
            {"text": "[done] persisted to scores/2026-05-12.parquet", "color": "ok"}
        ]},
        {"type": "code", "lang": "python", "filename": "churn/ensemble.py", "code": "from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier\nfrom sklearn.calibration import CalibratedClassifierCV\n\nclass ChurnEnsemble:\n    def __init__(self):\n        self.rf = RandomForestClassifier(n_estimators=400, class_weight='balanced')\n        self.gb = GradientBoostingClassifier(n_estimators=300, max_depth=4)\n        self.cal = None\n\n    def fit(self, X, y):\n        self.rf.fit(X, y)\n        self.gb.fit(X, y)\n        meta = self._meta(X)\n        self.cal = CalibratedClassifierCV(cv='prefit')\n        self.cal.fit(meta, y)\n        return self\n\n    def _meta(self, X):\n        return 0.55 * self.rf.predict_proba(X)[:, 1] + 0.45 * self.gb.predict_proba(X)[:, 1]"}
    ],
    "it-support-automation": [
        {"type": "github", "repo": "Smart-IT-Support-Automation-System"},
        {"type": "terminal", "title": "it bot · ticket replay", "lines": [
            {"prompt": "$", "text": "itbot tail --queue servicenow.l1", "color": "in"},
            {"text": "[ticket INC0124511]  password reset  user: a.singh", "color": "muted"},
            {"text": "  classify: password_reset  confidence: 0.97", "color": "ok"},
            {"text": "  runbook: ad/reset.yml         executing ...", "color": "muted"},
            {"text": "  ad.reset_password(user='a.singh')  ok", "color": "ok"},
            {"text": "  email sent. ticket closed.   mttr 4s", "color": "ok"},
            {"text": "[ticket INC0124512]  vpn drop frequent  user: m.brown", "color": "muted"},
            {"text": "  classify: vpn_connectivity  confidence: 0.61", "color": "warn"},
            {"text": "  below threshold. running diagnostics ...", "color": "muted"},
            {"text": "  collected logs, ping, mtr. route to L2 with context.", "color": "warn"},
            {"text": "[stats] auto-resolved 71%  escalated 29%  last 24h.", "color": "ok"}
        ]},
        {"type": "code", "lang": "python", "filename": "bot/classify.py", "code": "from llm import classify\nfrom runbooks import LIBRARY\n\nCONFIDENCE_THRESHOLD = 0.85\n\ndef handle_ticket(ticket):\n    label, conf = classify(ticket.text, labels=LIBRARY.keys())\n    if conf < CONFIDENCE_THRESHOLD:\n        diagnostics = run_diagnostics_for(label, ticket)\n        return escalate(ticket, label, conf, diagnostics)\n    runbook = LIBRARY[label]\n    result = runbook.execute(ticket)\n    return close(ticket, runbook, result)"}
    ],
    "network-ids": [
        {"type": "github", "repo": "Network_Intrusion_Detection"},
        {"type": "terminal", "title": "nids · live flow", "lines": [
            {"prompt": "$", "text": "nids tail --iface eth0 --model flow-rf-v3", "color": "in"},
            {"text": "[capture] eth0 promiscuous mode   ok", "color": "ok"},
            {"text": "[ok] flow 10.0.4.21 -> 10.0.4.40    tcp 443  benign  0.04", "color": "muted"},
            {"text": "[ok] flow 10.0.4.21 -> 10.0.4.40    tcp 443  benign  0.05", "color": "muted"},
            {"text": "[!] flow 10.0.4.21 -> 185.x.x.x     tcp 4444 ALERT   0.91", "color": "err"},
            {"text": "      asymmetry: high   beacon: 60s   size: small repeats", "color": "warn"},
            {"text": "      pattern matches: c2 beaconing", "color": "warn"},
            {"text": "[ok] alert sent to soc queue. flow tagged.", "color": "ok"}
        ]},
        {"type": "code", "lang": "python", "filename": "nids/features.py", "code": "import numpy as np\n\ndef flow_features(flow):\n    durations = np.diff(flow.packet_times)\n    return {\n        'duration':       flow.end - flow.start,\n        'pkt_count':      len(flow.packets),\n        'bytes_total':    sum(p.size for p in flow.packets),\n        'bytes_per_sec':  flow.total_bytes / max(flow.duration, 1e-6),\n        'pkt_asymmetry':  flow.out_pkts / max(flow.in_pkts, 1),\n        'inter_arrival':  np.median(durations) if len(durations) else 0,\n        'beacon_score':   beacon_score(durations),\n        'protocol':       flow.protocol,\n        'port':           flow.dst_port,\n    }"}
    ],
    "crypto-vault": [
        {"type": "github", "repo": "cyber-vault-new"},
        {"type": "code", "lang": "typescript", "filename": "app/portfolio.tsx", "code": "import { useHoldings, usePrices } from '@/lib/api';\n\nexport default function Portfolio() {\n  const holdings = useHoldings();\n  const prices = usePrices(holdings.map((h) => h.symbol));\n  const totalUsd = holdings.reduce((sum, h) =>\n    sum + h.qty * (prices[h.symbol] ?? 0), 0);\n\n  return (\n    <main className=\"min-h-screen bg-black text-white\">\n      <HeaderBalance value={totalUsd} delta={holdings.dayChange} />\n      <HoldingsList rows={holdings} prices={prices} />\n      <ProgressiveDisclosure>\n        <AdvancedOrders />\n        <CustodyOptions />\n        <SecuritySettings />\n      </ProgressiveDisclosure>\n    </main>\n  );\n}"},
        {"type": "terminal", "title": "vault · build & start", "lines": [
            {"prompt": "$", "text": "pnpm dev", "color": "in"},
            {"text": "[next] ready in 1.3s on http://localhost:3000", "color": "ok"},
            {"text": "[i]    secure context: https ok, key store ok", "color": "muted"},
            {"text": "[ok]   prices feed connected. 412 pairs", "color": "ok"},
            {"text": "[ok]   ws://stream    open", "color": "ok"},
            {"text": "[i]    portfolio page rendered. lcp 1.4s", "color": "muted"}
        ]}
    ]
}

for p in data['featured']:
    p['media'] = media.get(p['slug'], [{"type": "github", "repo": p['repo']}])

json.dump(data, open(path, 'w'), indent=2)
print(f'Wrote {len(data["featured"])} projects with media arrays')
for p in data['featured']:
    print(f"  {p['slug']:30}  {len(p['media'])} items")
