CREATE TABLE `service_tier` (
    `service_tier_id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `tier_name` TEXT NOT NULL,
    `config` TEXT NOT NULL
);
CREATE INDEX `idx_service_tier_name` ON `service_tier` (`tier_name`);

INSERT INTO `service_tier` (`tier_name`, `config`) VALUES
('FREE',
'[
  {"identifierType":"USER","accumulationKey":"PRODUCT","accumulationCycle":"LIFETIME","maxLimit":5},
  {"identifierType":"USER","accumulationKey":"ORDER","accumulationCycle":"DAILY","maxLimit":5},
  {"identifierType":"USER","accumulationKey":"ORDER","accumulationCycle":"WEEKLY","maxLimit":20},
  {"identifierType":"USER","accumulationKey":"ORDER","accumulationCycle":"MONTHLY","maxLimit":100}
]'
),
('PLUS',
'[
  {"identifierType":"USER","accumulationKey":"PRODUCT","accumulationCycle":"LIFETIME","maxLimit":15},
  {"identifierType":"USER","accumulationKey":"ORDER","accumulationCycle":"DAILY","maxLimit":25},
  {"identifierType":"USER","accumulationKey":"ORDER","accumulationCycle":"WEEKLY","maxLimit":100},
  {"identifierType":"USER","accumulationKey":"ORDER","accumulationCycle":"MONTHLY","maxLimit":500}
]'
),
('PRO',
'[
  {"identifierType":"USER","accumulationKey":"PRODUCT","accumulationCycle":"LIFETIME","maxLimit":35},
  {"identifierType":"USER","accumulationKey":"ORDER","accumulationCycle":"DAILY","maxLimit":55},
  {"identifierType":"USER","accumulationKey":"ORDER","accumulationCycle":"WEEKLY","maxLimit":200},
  {"identifierType":"USER","accumulationKey":"ORDER","accumulationCycle":"MONTHLY","maxLimit":1000}
]'
);

CREATE TABLE `accumulation` (
    `accumulation_id` TEXT NOT NULL PRIMARY KEY,
    `identifier_type` TEXT NOT NULL,
    `identifier` TEXT NOT NULL,
    `accumulation_key` TEXT NOT NULL,
    `accumulation_cycle` TEXT NOT NULL,
    `accumulation_cycle_id` TEXT NOT NULL,
    `accumulation_value` INTEGER NOT NULL
);
CREATE INDEX `idx_accumulation_specific` ON `accumulation` (
    `identifier_type`,`identifier`,`accumulation_key`,`accumulation_cycle`,`accumulation_cycle_id`
);
