/* eslint no-console: 0 */
'use strict';

module.exports = function (app, config, logger) {
  app.get('/health', (req, res) => {
    res.json({ok:true}).end();
  });

  // curl http://localhost:3000/hello/bob
  // curl http://localhost:3000/hello/bob?salutation=mr
  app.get('/hello/:name', (req, res) => {
    const name       = req.params.name,
          salutation = req.query.salutation;
    if (!name || name === '') {
      logger.error('You did not provide a name!')
      return res.status(400).json({error:0x0001, message:'POST /hello >>> Must provide a field "name"'}).end();
    }
    res.json({message: `${salutation ? salutation + ' ': ''}hello ${name}`}).end();
  });

  // curl -X POST http://localhost:3000/hello -H 'Content-Type: application/json; charset=UTF-8' -d '{"name":"bob"}'
  app.post('/hello', (req, res) => {
    const name = req.body.name;
    if (!name || name === '') {
      logger.error('You did not provide a name!')
      return res.status(400).json({error:0x0001, message:'POST /hello >>> Must provide a field "name"'}).end();
    }
    res.json({message: `hello ${name}`}).end();
  });
};
