import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np

# ── Risk Register Data ──────────────────────────────────────────────
risks = [
    {"id": "R-01", "desc": "Accidental deletion /\nCorruption of Git files",     "impact": 5, "prob": 5, "priority": 25},
    {"id": "R-02", "desc": "Extended absence /\nillness of team members",        "impact": 4, "prob": 5, "priority": 20},
    {"id": "R-03", "desc": "Major tech stack\nchange in mid-sprint",             "impact": 1, "prob": 5, "priority": 5},
    {"id": "R-04", "desc": "Hardware Failure",                                   "impact": 3, "prob": 4, "priority": 12},
    {"id": "R-05", "desc": "Communication breakdown\n/ faulty expectations",     "impact": 3, "prob": 5, "priority": 15},
    {"id": "R-06", "desc": "Third-party API\ndowntime",                          "impact": 1, "prob": 4, "priority": 4},
    {"id": "R-07", "desc": "Scope creep",                                        "impact": 4, "prob": 4, "priority": 16},
    {"id": "R-08", "desc": "Poor Task time\nestimation",                         "impact": 5, "prob": 4, "priority": 20},
    {"id": "R-09", "desc": "Minor UI\nInconsistencies",                          "impact": 2, "prob": 1, "priority": 2},
]

# ── Build 5×5 priority matrix (Impact × Probability) ───────────────
matrix = np.zeros((5, 5), dtype=int)
for i in range(1, 6):
    for j in range(1, 6):
        matrix[5 - j][i - 1] = i * j  # rows: prob top-down, cols: impact left-right

# ── Color map: green → yellow → orange → red ───────────────────────
def priority_color(val):
    if val <= 4:
        return "#4CAF50"   # green
    elif val <= 9:
        return "#8BC34A"   # light green
    elif val <= 12:
        return "#FFEB3B"   # yellow
    elif val <= 16:
        return "#FF9800"   # orange
    else:
        return "#F44336"   # red

# ── Create figure ───────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(12, 10))
fig.patch.set_facecolor("#FAFAFA")
ax.set_facecolor("#FAFAFA")

cell_size = 1

# Draw colored cells with priority numbers
for row in range(5):
    for col in range(5):
        val = matrix[row][col]
        color = priority_color(val)
        rect = mpatches.FancyBboxPatch(
            (col * cell_size, row * cell_size),
            cell_size, cell_size,
            boxstyle="round,pad=0.02",
            facecolor=color, edgecolor="white", linewidth=2.5,
            alpha=0.85
        )
        ax.add_patch(rect)
        # Priority number in corner
        ax.text(
            col * cell_size + 0.08, row * cell_size + 0.08,
            str(val), fontsize=9, color="#555", fontweight="bold",
            va="bottom", ha="left", alpha=0.5
        )

# ── Place risk labels on the heatmap ────────────────────────────────
# Track cells with multiple risks for offset
cell_counts = {}
for r in risks:
    col = r["impact"] - 1
    row = 5 - r["prob"]
    key = (row, col)
    cell_counts[key] = cell_counts.get(key, 0)

    cx = col * cell_size + 0.5
    cy = row * cell_size + 0.5

    # Offset if multiple risks share same cell
    count = cell_counts[key]
    offsets = [(0, 0), (-0.22, 0.18), (0.22, 0.18), (-0.22, -0.18), (0.22, -0.18)]
    if count < len(offsets):
        dx, dy = offsets[count]
    else:
        dx, dy = 0, 0
    cx += dx
    cy += dy

    cell_counts[key] += 1

    # Risk ID badge
    badge = mpatches.FancyBboxPatch(
        (cx - 0.18, cy - 0.12), 0.36, 0.24,
        boxstyle="round,pad=0.04",
        facecolor="white", edgecolor="#333",
        linewidth=1.5, alpha=0.95, zorder=10
    )
    ax.add_patch(badge)
    ax.text(
        cx, cy, r["id"],
        fontsize=9, fontweight="bold", color="#1A1A1A",
        ha="center", va="center", zorder=11,
        fontfamily="monospace"
    )

# ── Axis labels ─────────────────────────────────────────────────────
impact_labels = ["1\nVery Low", "2\nLow", "3\nMedium", "4\nHigh", "5\nVery High"]
prob_labels   = ["1\nRare", "2\nUnlikely", "3\nPossible", "4\nLikely", "5\nAlmost\nCertain"]

ax.set_xticks([i + 0.5 for i in range(5)])
ax.set_xticklabels(impact_labels, fontsize=10, fontweight="medium", color="#333")
ax.set_yticks([i + 0.5 for i in range(5)])
ax.set_yticklabels(prob_labels[::-1], fontsize=10, fontweight="medium", color="#333")

ax.set_xlim(0, 5)
ax.set_ylim(0, 5)
ax.set_aspect("equal")

ax.set_xlabel("IMPACT  →", fontsize=13, fontweight="bold", color="#1A1A1A", labelpad=15)
ax.set_ylabel("← PROBABILITY", fontsize=13, fontweight="bold", color="#1A1A1A", labelpad=15)

# Remove spines
for spine in ax.spines.values():
    spine.set_visible(False)
ax.tick_params(length=0)

# ── Title ───────────────────────────────────────────────────────────
ax.set_title(
    "Risk Heatmap — Petals & Pots",
    fontsize=18, fontweight="bold", color="#1A1A1A", pad=25
)

# ── Legend (risk descriptions) ──────────────────────────────────────
legend_text = "\n".join([
    f"{r['id']}  ({r['priority']:>2})  {r['desc'].replace(chr(10), ' ')}"
    for r in sorted(risks, key=lambda x: -x["priority"])
])

fig.text(
    0.5, -0.02, legend_text,
    fontsize=8.5, fontfamily="monospace", color="#444",
    ha="center", va="top",
    bbox=dict(boxstyle="round,pad=0.8", facecolor="#F0F0F0", edgecolor="#CCC", alpha=0.9)
)

# ── Color legend ────────────────────────────────────────────────────
legend_patches = [
    mpatches.Patch(color="#4CAF50", label="Low (1–4)"),
    mpatches.Patch(color="#8BC34A", label="Medium-Low (5–9)"),
    mpatches.Patch(color="#FFEB3B", label="Medium (10–12)"),
    mpatches.Patch(color="#FF9800", label="High (13–16)"),
    mpatches.Patch(color="#F44336", label="Critical (17–25)"),
]
ax.legend(
    handles=legend_patches, loc="upper left",
    bbox_to_anchor=(1.02, 1), fontsize=9,
    title="Priority Level", title_fontsize=10,
    frameon=True, fancybox=True, shadow=True,
    edgecolor="#CCC"
)

plt.tight_layout()
plt.savefig("risk_heatmap.png", dpi=200, bbox_inches="tight", facecolor="#FAFAFA")
plt.show()

print("\n✅ Heatmap saved as risk_heatmap.png")
