const { Router } = require('express')
const PessoaController = require('../controllers/PessoaController')

const router = Router()

router
  .get('/pessoas', PessoaController.pegaPessoasAtivas)
  .get('/pessoas/todos', PessoaController.pegaTodasAsPessoas)
  .get('/pessoas/viewdeletado', PessoaController.consultaTodasAsPessoasApagadas)
  .get('/pessoas/:id', PessoaController.pegaUmaPessoa)
  .get('/pessoas/:id/viewdeletado', PessoaController.consultaPessoaApagada)
  .post('/pessoas', PessoaController.criaPessoa)
  .put('/pessoas/:id', PessoaController.atualizaPessoa)
  .delete('/pessoas/:id', PessoaController.apagaPessoa)
  .delete('/pessoas/:id/harddeletepessoa', PessoaController.hardDeletePessoa)
  .get('/pessoas/:estudanteId/matricula/:matriculaId',  PessoaController.pegaUmaMatricula)
  .post('/pessoas/:estudanteId/matricula', PessoaController.criaMatricula)
  .post('/pessoas/:id/restaura', PessoaController.restauraPessoa)
  .post('/pessoas/:estudanteId/matricula/:matriculaId/restaura', PessoaController.restauraMatricula)
  .put('/pessoas/:estudanteId/matricula/:matriculaId',  PessoaController.atualizaMatricula)
  .delete('/pessoas/:estudanteId/matricula/:matriculaId',  PessoaController.apagaMatricula)

module.exports = router