const getTeamsQuery = {
    type: 'object',
    properties: {
        id: {
            type: ['array', 'number'],
            items: { type: 'number' }
        },
        name: {
            type: ['array', 'string'],
            items: { type: 'string' }
        },
        gitlab_id: {
            type: ['array', 'number'],
            items: { type: 'number' }
        },
        members: { type: ['array', 'string', 'number'] },
        prog_lang: {
            type: ['array', 'string'],
            items: { type: 'string' }
        },
        competition: { type: ['array', 'string', 'number'] },

        is_paid: { type: 'boolean' },
        min_paid_time: { type: 'string' },
        max_paid_time: { type: 'string' },
        is_eligible: { type: 'boolean' },

        is_embargoed: { type: 'boolean' },
        min_last_embargoed_time: { type: 'string' },
        max_last_embargoed_time: { type: 'string' },

        min_created_time: { type: 'string' },
        max_created_time: { type: 'string' },
        min_modified_time: { type: 'string' },
        max_modified_time: { type: 'string' },

        offset: { type: ['number', 'string'] },
        limit: {
            type: 'number',
            minimum: 1
        }
    },
    additionalProperties: false
};

const getTeamParams = {
    type: 'object',
    properties: {
        id: { type: ['string', 'number'] },
    },
    additionalProperties: false
};

const createTeamBody = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        gitlab_id: { type: ['string', 'number'] },
        members: {
            type: 'array',
            items: { type: ['string', 'number'] },
        },
        prog_lang: { type: 'string' },
        competition: { type: ['string', 'number'] },
        is_paid: { type: 'boolean' },
        is_eligible: { type: 'boolean' },
        is_embargoed: { type: 'boolean' },
        embargo_reason: { type: 'string' },
    },
    required: ['name'],
    additionalProperties: false
};

const updateTeamBody = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        gitlab_id: { type: ['string', 'number'] },
        members: {
            type: 'array',
            items: { type: ['string', 'number'] },
        },
        prog_lang: { type: 'string' },
        competition: { type: ['string', 'number'] },
        is_paid: { type: 'boolean' },
        is_eligible: { type: 'boolean' },
        is_embargoed: { type: 'boolean' },
        embargo_reason: { type: 'string' },
    },
    additionalProperties: false
};

const updateTeamParams = {
    type: 'object',
    properties: {
        id: { type: 'number' },
    },
    additionalProperties: false
};

export {
    getTeamsQuery,
    getTeamParams,
    createTeamBody,
    updateTeamBody,
    updateTeamParams
};
