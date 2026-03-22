from api.models.blueprints import BoxingBlueprint, BoxingBlueprintScenario


BOXING_BLUEPRINT_LIBRARY: list[BoxingBlueprint] = [
    BoxingBlueprint(
        id="boxing-blueprint-out-boxer",
        slug="out-boxer",
        name="Out-Boxer Foundation",
        style="out-boxer",
        summary="Built around range control, clean entries, and safe exits.",
        description=(
            "A long-range boxing blueprint for fighters who win exchanges with the jab, "
            "foot positioning, and disciplined resets after scoring."
        ),
        scenarios=[
            BoxingBlueprintScenario(
                id="out-boxer-jab-entry",
                title="Own the lead-hand battle",
                summary="Probe with the jab, shift the feet after contact, and reset before counters arrive.",
            ),
            BoxingBlueprintScenario(
                id="out-boxer-angle-exit",
                title="Exit off the line",
                summary="After a scored exchange, pivot away from the opponent's power side to keep range.",
            ),
            BoxingBlueprintScenario(
                id="out-boxer-pressure-response",
                title="Manage forward pressure",
                summary="Use frames, jabs, and step-backs to stop a pressure fighter from setting their feet.",
            ),
        ],
    ),
    BoxingBlueprint(
        id="boxing-blueprint-boxer-puncher",
        slug="boxer-puncher",
        name="Boxer-Puncher Foundation",
        style="boxer-puncher",
        summary="Balances sharp mechanics with enough force to punish predictable reactions.",
        description=(
            "A mid-range blueprint for fighters who can box behind structure, then sit down on punches "
            "when openings appear."
        ),
        scenarios=[
            BoxingBlueprintScenario(
                id="boxer-puncher-jab-cross-hook",
                title="Turn the jab into offense",
                summary="Use the jab to draw a high guard, then follow with a right hand or left hook.",
            ),
            BoxingBlueprintScenario(
                id="boxer-puncher-counter-pressure",
                title="Punish reckless entries",
                summary="Give ground just enough to create space for a hard counter as the opponent rushes in.",
            ),
            BoxingBlueprintScenario(
                id="boxer-puncher-close-round",
                title="Finish exchanges strong",
                summary="Close a winning exchange with the heavier final shot before resetting position.",
            ),
        ],
    ),
    BoxingBlueprint(
        id="boxing-blueprint-swarmer",
        slug="swarmer",
        name="Swarmer Foundation",
        style="swarmer",
        summary="Designed for high-pressure fighters who create volume once they enter inside range.",
        description=(
            "An inside-fighting blueprint focused on cutting the ring, staying active at close range, "
            "and making opponents uncomfortable under constant pressure."
        ),
        scenarios=[
            BoxingBlueprintScenario(
                id="swarmer-cut-off-ring",
                title="Trap the opponent near the ropes",
                summary="Step laterally to remove escape lanes, then start the exchange once range is closed.",
            ),
            BoxingBlueprintScenario(
                id="swarmer-body-head-flow",
                title="Work body to head",
                summary="Start downstairs to freeze the guard, then bring the next shots back upstairs.",
            ),
            BoxingBlueprintScenario(
                id="swarmer-inside-reload",
                title="Stay active after contact",
                summary="After a short combination, keep the chest close and reload before the opponent resets.",
            ),
        ],
    ),
    BoxingBlueprint(
        id="boxing-blueprint-counterpuncher",
        slug="counterpuncher",
        name="Counterpuncher Foundation",
        style="counterpuncher",
        summary="Centered on reading triggers, drawing mistakes, and answering with efficient counters.",
        description=(
            "A reactive blueprint for fighters who prefer to make the opponent commit first, then score "
            "with timing, accuracy, and minimal wasted motion."
        ),
        scenarios=[
            BoxingBlueprintScenario(
                id="counterpuncher-slip-jab",
                title="Counter the lead attack",
                summary="Slip outside the jab and return immediately before the opponent recovers their guard.",
            ),
            BoxingBlueprintScenario(
                id="counterpuncher-pull-return",
                title="Make the cross miss",
                summary="Pull just out of range of the rear hand and fire back while the opponent is extended.",
            ),
            BoxingBlueprintScenario(
                id="counterpuncher-feint-draw",
                title="Draw the first move",
                summary="Use feints to provoke a predictable reaction, then answer the opening that appears.",
            ),
        ],
    ),
]
