#!/usr/bin/env python3
"""Assemble portal pages: _head.html + _src/<page>.body.html + _foot.html -> <page>.html"""
import os, re
here = os.path.dirname(os.path.abspath(__file__))
head = open(os.path.join(here, "_head.html")).read()
foot = open(os.path.join(here, "_foot.html")).read()
titles = {"index": "Login", "home": "Home", "library": "Library", "lesson": "Lesson", "core-four": "Core Four", "check-in": "Check-in", "calls": "Calls", "agents": "Agents", "assistant": "Assistant", "coach": "Coach"}
for f in sorted(os.listdir(os.path.join(here, "_src"))):
    if not f.endswith(".body.html"): continue
    page = f[:-len(".body.html")]
    body = open(os.path.join(here, "_src", f)).read()
    h = head.replace("{{TITLE}}", titles.get(page, page.title())).replace("{{PAGE}}", "login" if page == "index" else page)
    if page == "index":  # login page has its own chrome
        h = h.replace('<div id="chrome"></div>\n<main class="page">\n', '<main class="page">\n')
    open(os.path.join(here, page + ".html"), "w").write(h + body + foot)
    print("built", page + ".html")
