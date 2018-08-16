'use strict';

const { request } = require('../test');

describe('resolve test resolutions', function () {
    test('resolution info (1)', async () => {
        const {body} = await request
        .get('/v1/resolutions/test:ping')
        .expect(200);

        body.should.eql({
            id: 'test:ping',
            riskOfChange: -1,
            resolutions: [{
                description: 'Ping',
                id: 'fix',
                needsReboot: false,
                riskOfChange: -1
            }]
        });
    });

    test('resolution info (2)', async () => {
        const {body} = await request
        .get('/v1/resolutions/test:reboot')
        .expect(200);

        body.should.eql({
            id: 'test:reboot',
            riskOfChange: 4,
            resolutions: [{
                description: 'Reboot system',
                id: 'fix',
                needsReboot: true,
                riskOfChange: 4
            }]
        });
    });

    test('resolution info (3)', async () => {
        const {body} = await request
        .get('/v1/resolutions/test:debug')
        .expect(200);

        body.should.eql({
            id: 'test:debug',
            riskOfChange: 1,
            resolutions: [{
                description: 'Ping once',
                id: 'fix',
                needsReboot: false,
                riskOfChange: 1
            }, {
                description: 'Ping twice',
                id: 'alternative',
                needsReboot: false,
                riskOfChange: 2
            }]
        });
    });
});

describe('resolve vulnerabilities resolutions', function () {
    test('erratum resolution info', async () => {
        const {body} = await request
        .get('/v1/resolutions/vulnerabilities:RHSA-2018:0007')
        .expect(200);

        body.should.eql({
            id: 'vulnerabilities:RHSA-2018:0007',
            riskOfChange: -1,
            resolutions: [{
                description: 'Update packages (RHSA-2018:0007)',
                id: 'fix',
                needsReboot: true,
                riskOfChange: -1
            }]
        });
    });

    test('rule-based resolution info', async () => {
        const {body} = await request
        .get('/v1/resolutions/vulnerabilities:CVE_2017_6074_kernel|KERNEL_CVE_2017_6074')
        .expect(200);

        body.should.eql({
            id: 'vulnerabilities:CVE_2017_6074_kernel|KERNEL_CVE_2017_6074',
            riskOfChange: 3,
            resolutions: [{
                description: 'Update system to the latest kernel and reboot',
                id: 'kernel_update',
                needsReboot: true,
                riskOfChange: 3
            }, {
                description: 'Disable DCCP kernel module',
                id: 'mitigate',
                needsReboot: true,
                riskOfChange: 3
            }, {
                description: 'Make sure SELinux is enabled, enforcing and has selinux-policy-3.13.1-81.el7 or later on RHEL7',
                id: 'selinux_mitigate',
                needsReboot: true,
                riskOfChange: 3
            }]
        });
    });
});

describe('resolve advisor resolutions', function () {
    test('resolution info', async () => {
        const {body} = await request
        .get('/v1/resolutions/advisor:bond_config_issue|BOND_CONFIG_ISSUE')
        .expect(200);

        body.should.eql({
            id: 'advisor:bond_config_issue|BOND_CONFIG_ISSUE',
            riskOfChange: 3,
            resolutions: [{
                description: 'Correct Bonding Config Items',
                id: 'fix',
                needsReboot: false,
                riskOfChange: 3
            }]
        });
    });
});