const getScheduleQuery = {
    type: 'object',
    properties: {
        id: {
            type: ['array', 'string'],
            items: {
                type: 'string',
                pattern: '^[1-9][0-9]*$'
            },
            pattern: '^[1-9][0-9]*$'
        },
        type: {
            type: 'array',
            items: {
                enum: ['random', 'single-elim', 'triple-elim', 'swiss']
            },
            uniqueItems: true
        },

        include_all: { type: 'boolean' },
        include_alum: { type: 'boolean' },
        include_dev: { type: 'boolean' },
        include_eligbile: { type: 'boolean' },
        include_sponsor: { type: 'boolean' },

        max_created_time: { type: 'string' },
        min_created_time: { type: 'string' },
        max_modified_time: { type: 'string' },
        min_modified_time: { type: 'string' },

        limit: {
            type: 'number',
            minimum: 1,
        }
    },
    additionalProperties: false
};

const getScheduleParams = {
    type: 'object',
    properties: {
        id: {
            type: 'string',
            pattern: '^[1-9][0-9]*$'
        }
    },
    required: ['id'],
    additionalProperties: false
};

const createSchedule = {
    type: 'object',
    properties: {
        'type': {
            enum: ['random', 'single-elim', 'triple-elim', 'swiss']
        },
        include_all: { type: 'boolean' },
        include_alum: { type: 'boolean' },
        include_devs: { type: 'boolean' },
        include_eligbile: { type: 'boolean' },
        include_sponsor: { type: 'boolean' }
    },
    additionalProperties: false
};

const updateScheduleParams = {
    type: 'object',
    properties: {
        type: { enum: ['random', 'single-elim', 'triple-elim', 'swiss'] },
        include_all: { type: 'boolean' },
        include_alum: { type: 'boolean' },
        include_devs: { type: 'boolean' },
        include_eligbile: { type: 'boolean' },
        include_sponsor: { type: 'boolean' }
    },
    additionalProperties: false
};

const scheduleData = {
    type: 'object',
    properties: {
        data: { type: 'object' }
    },
    additionalProperties: false
};

const scheduleResult = {
    type: 'object',
    properties: {
        result: { type: 'object' }
    },
    additionalProperties: false
};

export {
    getScheduleQuery,
    getScheduleParams,
    createSchedule,
    updateScheduleParams,
    scheduleData,
    scheduleResult
};
