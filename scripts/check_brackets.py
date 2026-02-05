from pathlib import Path
p=Path(r'c:/Users/LAXrobotics-Admin/Documents/GitHub/LaCrosseRoboticsSite/script.js')
s=p.read_text()
counts={'(':0,')':0,'{':0,'}':0,'[':0,']':0}
for i,ch in enumerate(s):
    if ch in counts:
        counts[ch]+=1
print(counts)
# find first place where prefix counts go negative for any closing
c={'(':0,'{':0,'[':0}
for i,ch in enumerate(s):
    if ch in '({[':
        c[ch]+=1
    if ch in ')}]':
        if ch==')': key='('
        elif ch=='}': key='{' 
        else: key='['
        c[key]-=1
        if c[key]<0:
            print('Negative at', i, ch)
            break
open_stack=[]
for i,ch in enumerate(s):
    if ch in '({[':
        open_stack.append((ch,i))
    if ch in ')}]':
        if not open_stack:
            print('Extra closing', ch, 'at', i)
            break
        last, pos = open_stack[-1]
        pairs = {')':'(', '}':'{', ']':'['}
        if last == pairs[ch]:
            open_stack.pop()
        else:
            line = s.count('\n',0,i)+1
            ctx = s[max(0,i-40):i+40]
            print('Mismatched at index', i, 'line', line)
            print('Found', ch, 'but expected closing for', last, 'opened at', pos)
            print('Context:\n', ctx)
            break
if open_stack:
    print('Unclosed openings (last 10):')
    for ch,pos in open_stack[-10:]:
        # compute line number
        line = s.count('\n',0,pos)+1
        print(f" {ch} opened at index {pos} (line {line})")
print('done')
