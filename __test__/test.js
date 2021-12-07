const request = require('supertest');

const mongoose = require('mongoose');
const app = require('../index');


describe('Record routes', () => {
  
  beforeAll(async () => {
    
    await mongoose.connect("mongodb+srv://challengeUser:WUMglwNBaydH8Yvu@challenge-xzwqd.mongodb.net/getir-case-study?retryWrites=true", { useUnifiedTopology: true });
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });
  

  describe('POST ', () => {

    it('should return 200 and successfully create fetch data from DB', async () => {
    
      const startDate = "2016-01-26";
      const endDate = "2018-02-02";

      const res = await request(app)
        .post('/file')
        .send({
          startDate,
          endDate,
          minCount: 2700,
          maxCount: 3000, // this number exists in db
        })
   

      expect(res.body).toEqual({
        code: 0,
        msg: 'Success',
        records: expect.any(Array),
      });
    });

   

    it('should return 400 if request startDate is missing', async () => {
     
      const endDate = "2018-02-02";
        
      const res = await request(app)
        .post('/file')
        .send({
          endDate,
          minCount: 2700,
          maxCount: 3000, // this number exists in db
        })
        

      expect(res.body).toEqual({
        code: 400,
        msg: expect.any(String),
       
      });
    });

    it('should return 400 if request endDate is missing', async () => {
     
      const startDate = "2016-01-26";
      const res = await request(app)
        .post('/file')
        .send({
          startDate,
          minCount: 1,
          maxCount: 6000, // this number exists in db
        });

      expect(res.body).toEqual({
        code: 400,
        msg: expect.any(String),
      });
    });

    it('should return 400 if request minCount is missing', async () => {
        const startDate = "2016-01-26";
        const endDate = "2018-02-02";
      const res = await request(app)
        .post('/file')
        .send({
          startDate,
          endDate,
          maxCount: 3000, // this number exists in db
        });

      expect(res.body).toEqual({
        code: 400,
        msg: expect.any(String),
      });
    });

    it('should return 400 if request maxCount is missing', async () => {
        const startDate = "2016-01-26";
        const endDate = "2018-02-02";
      const res = await request(app)
        .post('/file')
        .send({
          startDate,
          endDate,
          minCount: 2700,
        });

      expect(res.body).toEqual({
        code: 400,
        msg: expect.any(String),
        
      });
    });

    it('should return 400 when startDate is in wrong format', async () => {
      const startDate = 1;

      const res = await request(app)
        .post('/file')
        .send({
          startDate,
        })
        

      expect(res.body).toEqual({
        code: 400,
        msg: expect.any(String),
      });
    });

    it('should return 400 when endDate is in wrong format', async () => {
      const endDate = 1;

      const res = await request(app)
        .post('/file')
        .send({
          endDate,
        })

      expect(res.body).toEqual({
        code: 400,
        msg: expect.any(String),
      });
    });

    it('should return 400 when maxCount is in wrong format', async () => {
      const maxCount = 'asdf';

      const res = await request(app)
        .post('/file')
        .send({
          maxCount,
        })

      expect(res.body).toEqual({
        code: 400,
        msg: expect.any(String),
      });
    });

    it('should return 400 when minCount is in wrong format', async () => {
      const minCount = 'hgsfa';
 
      const res = await request(app)
        .post('/file')
        .send({
          minCount,
        })

      expect(res.body).toEqual({
        code: 400,
        msg: expect.any(String),
      });
    });

    it('should return 400 when some additional key added', async () => {
      const someKey = 'someValue';
     
      const res = await request(app)
        .post('/file')
        .send({
          someKey,
        })

      expect(res.body).toEqual({
        code: 400,
        msg: expect.any(String),
      });
    });
    it('should return 404 when a request to an Url sended', async () => {
      const res = await request(app).post('/fasfasa')

      expect(res.body).toEqual({
        code: 404,
        msg: expect.any(String),
      });
    });

    
  });
});
