AtributesModelsSheet = ["Carisma", "Ciência", "Constituição", "Destreza", "Espiritualidade", "Força", "Furtividade", "Inteligência", "Percepção", "Will"]

# Stat conversion rules (attribute to base max)
# Maps attribute name to stat and conversion rate
STAT_CONVERSION_RULES = {
    "Constituição": {"stat": "life", "rate": 5},
    "Inteligência": {"stat": "mana", "rate": 5},
    "Will": {"stat": "sanity", "rate": 3},
    "Espiritualidade": {"stat": "ocultism", "rate": 3},
    "Destreza": {"stat": "defense", "rate": 2},
}

# Attribute name mapping for easier lookup
ATTRIBUTE_NAME_MAP = {
    "Constituição": "constitution",
    "Inteligência": "intelligence",
    "Will": "will",
    "Espiritualidade": "spirituality",
    "Destreza": "dexterity",
    "Força": "strength",
    "Carisma": "charisma",
    "Ciência": "science",
    "Furtividade": "stealth",
    "Percepção": "perception",
}