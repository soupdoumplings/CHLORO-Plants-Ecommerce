import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np

fig, ax = plt.subplots(1, 1, figsize=(28, 18))
fig.patch.set_facecolor('#FFFFFF')
ax.set_facecolor('#FFFFFF')

# ── Colour palette ──────────────────────────────────────────────
ROOT_CLR   = '#3B5249'   # dark green
ROOT_TXT   = '#FFFFFF'
L1_CLR     = '#6B8F7B'   # muted sage
L1_TXT     = '#FFFFFF'
L2_CLR     = '#E8E0D0'   # warm cream
L2_TXT     = '#3B3B3B'
LINE_CLR   = '#7A7A7A'

# ── Data ────────────────────────────────────────────────────────
title = "Petals & Pots\nE-Commerce Platform"

categories = [
    ("Authentication\n& Security", [
        "Auth Page UI\n(Login / Register)",
        "Supabase Auth\nIntegration",
        "Role-Based\nAccess (RBAC)",
        "Route Guards\n& Redirects",
    ]),
    ("Home &\nLanding Page", [
        "Hero Section\n& Animations",
        "Philosophy &\nBrand Story",
        "Category Shelf\n& Previews",
        "Why Choose Us\nSection",
    ]),
    ("Editorial\nCatalogue", [
        "Catalogue Hero\n& Ficus Spotlight",
        "Anatomy &\nHeritage Sections",
        "Care Guide\nSection",
        "Dynamic Supabase\nData Fetch",
    ]),
    ("Discovery\n& Shop", [
        "Product Grid\n& Cards",
        "Category Filter\nBar",
        "Newsletter\nSubscription",
        "Shop Page\nLayout",
    ]),
    ("Product\nDetail", [
        "Product Layout\n(Images / Info)",
        "Add to Cart\nAction",
        "Care Info\nDisplay",
    ]),
    ("Shopping\nCart", [
        "Cart Context /\nState Mgmt",
        "Cart Items &\nQuantity Controls",
        "Order Summary\n& Cross-Sell",
    ]),
    ("Checkout\n& Orders", [
        "Checkout Form\n(Shipping / Pay)",
        "Payment Gateway\n(eSewa / Khalti)",
        "Order History\n& Status",
    ]),
    ("User\nDashboard", [
        "Profile Header\n& Details",
        "Recent Orders\nPanel",
        "Logout\nFunctionality",
    ]),
    ("Admin Panel\n(Archive)", [
        "Metrics Grid\n(KPIs)",
        "Inventory Table\n(CRUD)",
        "System Log /\nActivity Feed",
    ]),
    ("Inventory\nManagement", [
        "Add / Edit\nPlant Forms",
        "Image Upload\n(Supabase Storage)",
        "Featured Product\nToggle",
    ]),
    ("AI Plant\nDiagnosis", [
        "Kindwise API\nIntegration",
        "Diagnosis Results\nDisplay",
        "Diagnosis History\nSaving",
    ]),
    ("Plant\nJournal", [
        "Watering Reminder\nCRUD",
        "Scheduling Logic\n(Frequency)",
        "Care Timeline\nDisplay",
    ]),
    ("Database &\nBackend", [
        "10 Supabase\nTables",
        "Row-Level Security\n(RLS) Policies",
        "Supabase Client\n& Config",
    ]),
]

n_cats = len(categories)

# ── Layout constants ────────────────────────────────────────────
PAGE_W = 28
PAGE_H = 18

ROOT_W, ROOT_H = 3.0, 1.0
L1_W, L1_H     = 1.7, 0.85
L2_W, L2_H     = 1.55, 0.72

ROOT_Y  = PAGE_H - 1.8
TRUNK_Y = ROOT_Y - ROOT_H / 2
L1_Y    = ROOT_Y - 3.0
L2_TOP  = L1_Y - L1_H / 2 - 1.2

total_l1_width = n_cats * L1_W + (n_cats - 1) * 0.35
l1_start_x = (PAGE_W - total_l1_width) / 2 + L1_W / 2

l1_positions = []
for i in range(n_cats):
    x = l1_start_x + i * (L1_W + 0.35)
    l1_positions.append(x)

root_x = PAGE_W / 2

# ── Helper: draw a box ─────────────────────────────────────────
def draw_box(ax, cx, cy, w, h, text, bg, fg, fontsize=7, bold=False):
    rect = mpatches.FancyBboxPatch(
        (cx - w/2, cy - h/2), w, h,
        boxstyle="round,pad=0.06",
        facecolor=bg, edgecolor='#999999', linewidth=0.8
    )
    ax.add_patch(rect)
    weight = 'bold' if bold else 'normal'
    ax.text(cx, cy, text, ha='center', va='center',
            fontsize=fontsize, color=fg, fontweight=weight,
            fontfamily='sans-serif', linespacing=1.15)

# ── Draw root ───────────────────────────────────────────────────
draw_box(ax, root_x, ROOT_Y, ROOT_W, ROOT_H, title, ROOT_CLR, ROOT_TXT, fontsize=11, bold=True)

# ── Trunk line from root down to the horizontal bus ─────────────
bus_y = (ROOT_Y - ROOT_H/2 + L1_Y + L1_H/2) / 2
ax.plot([root_x, root_x], [ROOT_Y - ROOT_H/2, bus_y],
        color=LINE_CLR, linewidth=1.5, solid_capstyle='round')

# ── Horizontal bus spanning all L1 nodes ────────────────────────
ax.plot([l1_positions[0], l1_positions[-1]], [bus_y, bus_y],
        color=LINE_CLR, linewidth=1.5, solid_capstyle='round')

# ── L1 boxes + vertical drops from bus ──────────────────────────
for i, (cat_name, tasks) in enumerate(categories):
    cx = l1_positions[i]

    # vertical line from bus to L1 box
    ax.plot([cx, cx], [bus_y, L1_Y + L1_H/2],
            color=LINE_CLR, linewidth=1.2, solid_capstyle='round')

    draw_box(ax, cx, L1_Y, L1_W, L1_H, cat_name, L1_CLR, L1_TXT, fontsize=6.5, bold=True)

    # ── L2 children ─────────────────────────────────────────────
    n_tasks = len(tasks)
    l2_bus_y = L1_Y - L1_H/2 - 0.5

    # vertical drop from L1 to L2 bus
    ax.plot([cx, cx], [L1_Y - L1_H/2, l2_bus_y],
            color=LINE_CLR, linewidth=1.0, solid_capstyle='round')

    if n_tasks == 1:
        task_xs = [cx]
    else:
        spread = min((n_tasks - 1) * (L2_W + 0.08), L1_W + 0.6)
        task_xs = np.linspace(cx - spread/2, cx + spread/2, n_tasks)

    # horizontal L2 bus
    if n_tasks > 1:
        ax.plot([task_xs[0], task_xs[-1]], [l2_bus_y, l2_bus_y],
                color=LINE_CLR, linewidth=0.8, solid_capstyle='round')

    for j, task_name in enumerate(tasks):
        tx = task_xs[j]
        ty = l2_bus_y - 0.15 - L2_H / 2 - j * (L2_H + 0.2)

        # vertical drop from L2 bus
        ax.plot([tx, tx], [l2_bus_y, l2_bus_y - 0.15],
                color=LINE_CLR, linewidth=0.8, solid_capstyle='round')
        # then a line going down to the box
        ax.plot([tx, cx], [l2_bus_y, l2_bus_y],  # already drawn by bus
                color=LINE_CLR, linewidth=0, solid_capstyle='round')

        # stack L2 boxes vertically under each L1
        draw_box(ax, cx, ty, L2_W, L2_H, task_name, L2_CLR, L2_TXT, fontsize=5.2)

        # connecting line from previous box or bus
        if j == 0:
            ax.plot([cx, cx], [l2_bus_y, ty + L2_H/2],
                    color=LINE_CLR, linewidth=0.8, solid_capstyle='round')
        else:
            prev_ty = l2_bus_y - 0.15 - L2_H / 2 - (j-1) * (L2_H + 0.2)
            ax.plot([cx, cx], [prev_ty - L2_H/2, ty + L2_H/2],
                    color=LINE_CLR, linewidth=0.8, solid_capstyle='round')


# ── Title ───────────────────────────────────────────────────────
ax.text(PAGE_W / 2, PAGE_H - 0.3,
        "Work Breakdown Structure — Petals & Pots (Full Project)",
        ha='center', va='center', fontsize=14, fontweight='bold',
        color='#2D2D2D', fontfamily='sans-serif')

# ── Axes cleanup ────────────────────────────────────────────────
ax.set_xlim(0, PAGE_W)
ax.set_ylim(0, PAGE_H)
ax.set_aspect('equal')
ax.axis('off')

plt.tight_layout(pad=0.5)
plt.savefig('wbs_petals_and_pots.png', dpi=200, bbox_inches='tight',
            facecolor='#FFFFFF', edgecolor='none')
plt.savefig('wbs_petals_and_pots.pdf', bbox_inches='tight',
            facecolor='#FFFFFF', edgecolor='none')
print("Saved: wbs_petals_and_pots.png & .pdf")
plt.show()
