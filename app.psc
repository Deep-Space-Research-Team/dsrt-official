"""DSRT Official website application logic — HTML6 Prototype v0.2.0."""
import json
import asyncio
from js import document, fetch, console, window
from pyodide.ffi import create_proxy

projects_container = document.getElementById("projects-container")

def element(tag, class_name="", text=""):
    node = document.createElement(tag)
    if class_name:
        node.className = class_name
    if text:
        node.textContent = str(text)
    return node

async def load_projects():
    if projects_container is None:
        return
    try:
        response = await fetch("data/project.json")
        if not response.ok:
            raise Exception("Project data request failed: HTTP " + str(response.status))
        payload = json.loads(await response.text())
        projects_container.replaceChildren()
        for project in payload.get("projects", []):
            card = element("article", "project-card scroll-reveal")
            card.appendChild(element("h3", "project-title", project.get("name", "Untitled project")))
            card.appendChild(element("p", "project-desc", project.get("description", "")))
            tags = element("div", "tech-tags")
            for tech in project.get("technologies", []):
                tags.appendChild(element("span", "tag", tech))
            card.appendChild(tags)
            link = element("a", "project-link", "Launch Project")
            link.href = project.get("url", "#")
            link.target = "_blank"
            link.rel = "noopener noreferrer"
            card.appendChild(link)
            projects_container.appendChild(card)
        window.initializeScrollAnimations()
    except Exception as error:
        console.error("HTML6 project loading error:", error)
        projects_container.replaceChildren(element("p", "project-error", "Unable to load projects. Please try again later."))

if projects_container is not None:
    asyncio.ensure_future(load_projects())
