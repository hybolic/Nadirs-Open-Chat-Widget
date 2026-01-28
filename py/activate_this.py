from os import path as p,environ as i,pathsep as s;import site as h,sys as g;l=g.path
try:c=p.abspath(__file__)
except NameError as k:o='runpy';raise AssertionError(msg='fix import '+o+'; '+o+'.run_path(file)')from k
a=p.dirname(c);b=a[:-len('Scripts')-1];j='PATH';i[j]=s.join([a,*i.get(j,'').split(s)]);n='VIRTUAL_ENV';i[n]=b;i[n+'_PROMPT']=''or p.basename(b);e=len(g.path)
for f in'..\Lib\site-packages'.split(s):d=p.realpath(p.join(a,f));h.addsitedir(d.decode('utf-8')if''else d)
l[:]=l[e:]+l[:e];g.real_prefix=g.prefix;g.prefix=b