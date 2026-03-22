from api.models.blueprints import BlueprintStyle, BlueprintStyleToken


BLUEPRINT_STYLE_LIBRARY: list[BlueprintStyle] = [
    BlueprintStyle(
        id="blueprint-style-fundamentals",
        slug="fundamentals",
        name="Fundamentals",
        summary="Balanced defaults for the first reusable strategy blueprints.",
        description=(
            "A neutral blueprint style that emphasizes readability, hierarchy, "
            "and low-friction extension across strategy, scenario, sequence, and node layers."
        ),
        intended_for=[
            "Teams creating their first shared blueprint catalog",
            "Internal starter templates",
            "Designing safe defaults before sport-specific customization",
        ],
        recommended_node_types=["strategy", "scenario", "sequence", "node"],
        tokens=[
            BlueprintStyleToken(
                name="surface",
                value="#f6f1e8",
                usage="Primary card background for reusable blueprint shells.",
            ),
            BlueprintStyleToken(
                name="accent",
                value="#9f5c2c",
                usage="Highlight color for callouts, chips, and active branches.",
            ),
            BlueprintStyleToken(
                name="line",
                value="#d5c4af",
                usage="Hierarchy rails, borders, and blueprint separators.",
            ),
        ],
        notes=[
            "Keep spacing roomy so contributors can add metadata without reworking the layout.",
            "Favor labels that describe the intent of a branch, not just the move name.",
        ],
    ),
    BlueprintStyle(
        id="blueprint-style-film-room",
        slug="film-room",
        name="Film Room",
        summary="A denser review-oriented style for studying branches from notes or sparring clips.",
        description=(
            "This style leaves more room for annotations, counters, and outcome tags so "
            "a blueprint can double as a tactical review board."
        ),
        intended_for=[
            "Post-session review flows",
            "Opponent-specific prep",
            "Comment-heavy collaborative planning",
        ],
        recommended_node_types=["scenario", "sequence", "node"],
        tokens=[
            BlueprintStyleToken(
                name="surface",
                value="#1f2933",
                usage="Dark film-strip panel background for review modules.",
            ),
            BlueprintStyleToken(
                name="accent",
                value="#f6ad55",
                usage="Marks key coaching moments and branch outcomes.",
            ),
            BlueprintStyleToken(
                name="line",
                value="#52606d",
                usage="Subtle dividers between review sections.",
            ),
        ],
        notes=[
            "Annotation density is expected here, so reserve space for notes and tags.",
            "Use this style when a branch needs explanation as much as execution.",
        ],
    ),
]
