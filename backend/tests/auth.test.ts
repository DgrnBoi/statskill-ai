import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/index';

describe('Jan Parichay demo authentication', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-signing-secret';
  });

  it('issues a signed token containing server-owned JSO claims', async () => {
    const response = await request(app)
      .post('/api/auth/demo-login')
      .send({ officerId: 'jso', method: 'parichay-id' });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
    expect(jwt.verify(response.body.token, 'test-signing-secret')).toMatchObject({
      parichayId: 'PARICHAY_1042_NSSO',
      designation: 'Junior Statistical Officer (JSO)',
      division: 'Field Operations Division (FOD), NSSO',
    });
  });

  it('rejects an unknown officer identifier', async () => {
    const response = await request(app)
      .post('/api/auth/demo-login')
      .send({ officerId: 'not-a-cadre', method: 'parichay-id' });

    expect(response.status).toBe(400);
  });
});
