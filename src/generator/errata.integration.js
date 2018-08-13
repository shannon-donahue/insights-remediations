'use strict';

const { request } = require('../test');

test('generates a simple playbook with single RHSA remediation', async () => {
    const data = {
        issues: [{
            id: 'vulnerabilities:RHSA-2018:0502',
            systems: ['a8799a02-8be9-11e8-9eb6-529269fb1459']
        }]
    };

    const res = await request
    .post('/v1/playbook')
    .send(data)
    .expect(200);
    expect(res.text).toMatchSnapshot();
});

test('generates a simple playbook with multiple erratum-based remediation', async () => {
    const data = {
        issues: [{
            id: 'vulnerabilities:RHSA-2018:0502',
            systems: ['a8799a02-8be9-11e8-9eb6-529269fb1459']
        }, {
            id: 'vulnerabilities:RHBA-2007:0331',
            systems: ['53fbcd90-9c8f-11e8-98d0-529269fb1459']
        }]
    };

    const res = await request
    .post('/v1/playbook')
    .send(data)
    .expect(200);
    expect(res.text).toMatchSnapshot();
});

test('aggregates multiple errata into a single play', async () => {
    const data = {
        issues: [{
            id: 'vulnerabilities:RHSA-2018:0502',
            systems: ['a8799a02-8be9-11e8-9eb6-529269fb1459']
        }, {
            id: 'vulnerabilities:RHSA-2017:1852',
            systems: ['a8799a02-8be9-11e8-9eb6-529269fb1459']
        }, {
            id: 'vulnerabilities:RHSA-2017:1382',
            systems: ['a8799a02-8be9-11e8-9eb6-529269fb1459']
        }, {
            id: 'vulnerabilities:RHSA-2017:2679',
            systems: ['a8799a02-8be9-11e8-9eb6-529269fb1459']
        }]
    };

    const res = await request
    .post('/v1/playbook')
    .send(data)
    .expect(200);
    expect(res.text).toMatchSnapshot();
});

test('400s on unknown resolution type', () => {
    return request
    .post('/v1/playbook')
    .send({
        issues: [{
            id: 'vulnerabilities:RHSA-2018:99999',
            systems: ['a8799a02-8be9-11e8-9eb6-529269fb1459']
        }]
    })
    .expect(400)
    .then(({ body }) => {
        body.should.have.property('error', {
            code: 'UNSUPPORTED_ISSUE',
            message: 'Issue "vulnerabilities:RHSA-2018:99999" does not have Ansible support'
        });
    });
});

test('400s on unknown resolution type other than fix', () => {
    return request
    .post('/v1/playbook')
    .send({
        issues: [{
            id: 'vulnerabilities:RHSA-2018:0502',
            systems: ['a8799a02-8be9-11e8-9eb6-529269fb1459'],
            resolution: 'non-existing-resolution'
        }]
    })
    .expect(400)
    .then(({ body }) => {
        body.should.have.property('error', {
            code: 'UNKNOWN_RESOLUTION',
            message: 'Issue "vulnerabilities:RHSA-2018:0502"' +
                ' does not have Ansible resolution "non-existing-resolution"'
        });
    });
});
