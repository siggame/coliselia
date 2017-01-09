const getUsersQuery= {
    type: "object",
    properties: {
        id: {
            type: ["array", "number"],
        },
        name: {
            type: ["array", "string"],
            items: {type: "string"},
        },
        full_name: {
            type: ["array", "string"],
            items: {type: "string"},
        },
        email: {
            type: ["array", "string"],
            items: {type: "string"},
        },

        is_dev: {type: "boolean"},
        is_student: {type: "boolean"},
        is_sponsor: {type: "boolean"},
        is_prev_competitor: {type: "boolean"},

        min_created_time: {type: "string"},
        max_created_time: {type: "string"},
        min_modified_time: {type: "string"},
        max_modified_time: {type: "string"},
        limit: {type: "number"},
        offset: {type: "number"},
    },
    additionalProperties: false,
};

const getUserParams = {
    type: "object",
    properties: {
        id: {
            type: "string",
            pattern: "^[0-9]+$",
        },
    },
    required: ["id"],
    additionalProperties: false,
};

const createUserBody = {
    type: "object",
    properties: {
        name: { type: "string" },
        full_name: { type: "string" },
        email: { type: "string" },
        is_dev: { type: "boolean" },
        is_student: { type: "boolean" },
        is_sponsor: { type: "boolean" },
        is_prev_competitor: { type: "boolean" },
        shirt_size: { type: "string" },
        pizza_choice: { type: "string" },

    },
    required: ["name", "email"],
    additionalProperties: false,
};

const updateUserBody = {
    type: "object",
    properties: {
        name: { type: "string" },
        full_name: { type: "string" },
        email: { type: "string" },
        is_dev: { type: "boolean" },
        is_student: { type: "boolean" },
        is_sponsor: { type: "boolean" },
        is_prev_competitor: { type: "boolean" },
        shirt_size: { type: "string" },
        pizza_choice: { type: "string" },

    },
    additionalProperties: false,
};

const updateUserParams = {
    type: "object",
    properties: {
        id: {
            type: "string",
            pattern: "^[0-9]+$",
        },
    },
    additionalProperties: false,
};

export {
    getUsersQuery,
    getUserParams,
    createUserBody,
    updateUserBody,
    updateUserParams
};