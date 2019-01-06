'use strict';

const _ = require('lodash');
const DEFAULT_REMEDIATION_NAME = 'unnamed-remediation';
const PLAYBOOK_SUFFIX = 'yml';

exports.list = function (remediations) {
    const formatted = _.map(remediations, remediation => _.pick(remediation, [
        'id',
        'name',
        'created_by',
        'created_at',
        'updated_by',
        'updated_at',
        'needs_reboot',
        'system_count',
        'issue_count'
    ]));

    return {
        remediations: formatted
    };
};

exports.get = function ({id, name, needs_reboot, auto_reboot, created_by, created_at, updated_by, updated_at, issues}) {
    return {
        id,
        name,
        needs_reboot,
        auto_reboot,
        created_by,
        created_at,
        updated_by,
        updated_at,
        issues: _.map(issues, ({issue_id, resolution, details, systems, resolutionsAvailable }) => ({
            id: issue_id,
            description: details.description,
            resolution: {
                id: resolution.type,
                description: resolution.description,
                resolution_risk: resolution.resolutionRisk,
                needs_reboot: resolution.needsReboot
            },
            resolutions_available: resolutionsAvailable,
            systems: systems.map(({system_id, hostname, display_name}) => ({
                id: system_id,
                hostname,
                display_name: display_name || 'null' // FIXME
            }))
        }))
    };
};

exports.created = function ({id}) {
    return {id};
};

function playbookNamePrefix (name) {
    if (!name || !name.length) {
        return DEFAULT_REMEDIATION_NAME;
    }

    let result = name.toLowerCase().trim(); // no capital letters
    result = result.replace(/\s+/g, '-'); // no whitespace
    result = result.replace(/[^\w-]/g, ''); // only alphanumeric, hyphens or underscore
    return result;
}

exports.playbookName = function (remediation) {
    const name = playbookNamePrefix(remediation.name);
    const fileName = [name, new Date().getTime()];

    // my-remediation-1462522068064.yml
    return `${fileName.join('-')}.${PLAYBOOK_SUFFIX}`;
};
