import json, sys, os
infile = sys.argv[1] if len(sys.argv)>1 else 'semgrep-report.json'
if not os.path.exists(infile):
    print('Input file not found:', infile)
    sys.exit(1)
with open(infile) as f:
    data = json.load(f)
res = data.get('results', [])
if not res:
    print('No issues found.')
    sys.exit(0)
lines = ['# Semgrep Summary\n']
for i,r in enumerate(res,1):
    lines.append(f'## {i}. {r.get("check_id")}')
    lines.append(f'- file: {r.get("path")}')
    extra = r.get('extra',{})
    lines.append(f'- severity: {extra.get("severity")}')
    lines.append(f'- message: {extra.get("message")}')
    start = r.get('start',{})
    lines.append(f'- location: line {start.get("line")}, col {start.get("col")}')
    lines.append('')
out = '\n'.join(lines)
with open('semgrep-summary.md','w') as f:
    f.write(out)
print('Summary written to semgrep-summary.md')
