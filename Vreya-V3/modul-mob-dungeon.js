    const LocDunBase = [
        { location_id: 1, name: "Brood Pits" },
        { location_id: 2, name: "Plunder Warrens" },
        { location_id: 3, name: "Shattered Stone" },
        { location_id: 4, name: "Territory Center" },
        { location_id: 5, name: "Shadowbridge Boss" },
        { location_id: 6, name: "The Vizier" },
        { location_id: 7, name: "Bloodbound" },
        { location_id: 8, name: "Room of Beasts" },
        { location_id: 9, name: "Dead Crown" },
        { location_id: 10, name: "Castle Boss" },
        { location_id: 11, name: "Gate Prism" },
        { location_id: 12, name: "Ash Lane" },
        { location_id: 13, name: "Crown Lens" }
    ];

    const defaultNdMobs = [
        { location_id: 1, actived: false, name: "Orc Stone-Rend", exp: 0.0071, minDmg: 0, maxDmg: 0, count: 15 },
        { location_id: 1, actived: false, name: "Vorga Ash-Shaman", exp: 0.0066, minDmg: 0, maxDmg: 0, count: 15 },
        { location_id: 1, actived: false, name: "Krak One-Horn", exp: 0.0071, minDmg: 0, maxDmg: 0, count: 15 },
        { location_id: 1, actived: false, name: "Nib Wickfingers", exp: 0.008, minDmg: 0, maxDmg: 0, count: 15 },
        { location_id: 1, actived: false, name: "Skrit Gear", exp: 0.0105, minDmg: 0, maxDmg: 0, count: 15 },
        { location_id: 2, actived: false, name: "Shagra Bone-Singer", exp: 0.0071, minDmg: 0, maxDmg: 0, count: 15 },
        { location_id: 2, actived: false, name: "Urzul Iron-Tusks", exp: 0.0086, minDmg: 0, maxDmg: 0, count: 15 },
        { location_id: 2, actived: false, name: "Makra the Mireborn", exp: 0.012, minDmg: 0, maxDmg: 0, count: 15 },
        { location_id: 2, actived: false, name: "Talla Flint-Stem", exp: 0.008, minDmg: 0, maxDmg: 0, count: 10 },
        { location_id: 2, actived: false, name: "Gribble Junk-Magus", exp: 0.004, minDmg: 0, maxDmg: 0, count: 10 },
        { location_id: 3, actived: false, name: "Droknar Night-Blade", exp: 0.012, minDmg: 0, maxDmg: 0, count: 15 },
        { location_id: 3, actived: false, name: "Hruk Forge-Eater", exp: 0.0086, minDmg: 0, maxDmg: 0, count: 15 },
        { location_id: 3, actived: false, name: "Zorgra Frost-Vein", exp: 0.009, minDmg: 0, maxDmg: 0, count: 15 },
        { location_id: 3, actived: false, name: "Pip Tanglefoot", exp: 0.01, minDmg: 0, maxDmg: 0, count: 10 },
        { location_id: 3, actived: false, name: "Rukka The Wolf Raider", exp: 0.014, minDmg: 0, maxDmg: 0, count: 20 },
        { location_id: 4, actived: false, name: "Brog Skull", exp: 0.0067, minDmg: 0, maxDmg: 0, count: 15 },
        { location_id: 4, actived: false, name: "Tharka Blood-Howl", exp: 0.012, minDmg: 0, maxDmg: 0, count: 15 },
        { location_id: 4, actived: false, name: "Rukka The Wolf Raider", exp: 0.014, minDmg: 0, maxDmg: 0, count: 5 },
        { location_id: 4, actived: false, name: "Gorvash the Stone-Ram", exp: 0.009, minDmg: 0, maxDmg: 0, count: 5 },
        { location_id: 4, actived: false, name: "Gribble Junk-Magus", exp: 0.004, minDmg: 0, maxDmg: 0, count: 5 },
        { location_id: 5, actived: false, name: "Prince Grixkar The Hybrid", exp: 0.01, minDmg: 0, maxDmg: 0, count: 1 }
    ];

    const defaultHdMobs = [
        { location_id: 6, actived: false, name: "The Goblin Royal Vizier", exp: 0.0113, minDmg: 0, maxDmg: 0, count: 1 },
        { location_id: 7, actived: false, name: "Vorrak the Bloodbound Berserker", exp: 0.0113, minDmg: 0, maxDmg: 0, count: 1 },
        { location_id: 8, actived: false, name: "Grimgrowl the Chimera", exp: 0.0113, minDmg: 0, maxDmg: 0, count: 1 },
        { location_id: 9, actived: false, name: "Drazhul The Broken Crown", exp: 0.0113, minDmg: 0, maxDmg: 0, count: 1 },
        { location_id: 10, actived: false, name: "khaal The Abomination Prince", exp: 0.011, minDmg: 0, maxDmg: 0, count: 1 },
    ];

    const defaultCbMobs = [
        { location_id: 11, actived: false, name: "Prismblade Reaver", exp: 0.0115, minDmg: 0, maxDmg: 0, count: 8 },
        { location_id: 11, actived: false, name: "Mireglass Stalker", exp: 0.0115, minDmg: 0, maxDmg: 0, count: 8 },
        { location_id: 11, actived: false, name: "Siege-Root Howler", exp: 0.0115, minDmg: 0, maxDmg: 0, count: 6 },
        { location_id: 12, actived: false, name: "Null Choir Adept", exp: 0.0115, minDmg: 0, maxDmg: 0, count: 6 },
        { location_id: 12, actived: false, name: "Calibration Warden", exp: 0.0115, minDmg: 0, maxDmg: 0, count: 6 },
        { location_id: 12, actived: false, name: "Bastion Iterant", exp: 0.0115, minDmg: 0, maxDmg: 0, count: 6 },
        { location_id: 12, actived: false, name: "Polyhedral Devourer", exp: 0.0115, minDmg: 0, maxDmg: 0, count: 3 },
        { location_id: 13, actived: false, name: "Crown Resonator", exp: 0.0115, minDmg: 0, maxDmg: 0, count: 5 },
        { location_id: 13, actived: false, name: "Zenith Lancer", exp: 0.0115, minDmg: 0, maxDmg: 0, count: 5 },
        { location_id: 13, actived: false, name: "Warform of the Creator", exp: 0.0115, minDmg: 0, maxDmg: 0, count: 1 },
        { location_id: 13, actived: false, name: "Creator's Chosen Executor", exp: 0.0115, minDmg: 0, maxDmg: 0, count: 1 }
    ];