from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
data=json.loads((root/'plans.json').read_text())
assert len({p['id'] for p in data})==len(data), 'Duplicate plan ID'
(root/'plans-data.js').write_text('window.ZAYUMOBILE_PLANS = '+json.dumps(data,ensure_ascii=False,indent=2)+';\n')
