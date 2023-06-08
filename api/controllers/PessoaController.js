const { Op } = require('sequelize')
const { PessoasServices } = require('../services')   // como o nome do arquivo é index, não é necessário colocar a extensão /index.js
const pessoasServices = new PessoasServices()

class PessoaController {
  static async pegaPessoasAtivas(req, res){
    try {
      const pessoasAtivas = await pessoasServices.pegaRegistrosAtivos()
      return res.status(200).json(pessoasAtivas)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async pegaPessoasAtivasEInativas(req, res){
    try {
      const pessoasAtivasEInativas = await pessoasServices.pegaRegistrosAtivosEInativos()
      return res.status(200).json(pessoasAtivasEInativas)  
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }
  
  static async pegaTodasAsPessoas(req, res){
    try {
      const todasAsPessoas = await pessoasServices.pegaTodosOsRegistros()
      return res.status(200).json(todasAsPessoas)  
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async consultaTodasAsPessoasApagadas(req, res) {
    try{
      const todasAsPessoasApagadas = await pessoasServices.pegaTodosOsRegistros({
        deletedAt: { [Op.not]: null }
      })
      return res.status(200).json(todasAsPessoasApagadas)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async pegaPessoa(req, res) {
    const { id } = req.params
    try {
      const pessoa = await pessoasServices.pegaUmRegistro({ id })
      return res.status(200).json(pessoa)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }
  
  static async consultaPessoaApagada(req, res) {
    const { id } = req.params
    try {
      const umaPessoaApagada = await pessoasServices.pegaUmRegistroApagado(Number(id))
      return res.status(200).json(umaPessoaApagada)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async consultaPessoaInativa(req, res) {
    const { id } = req.params
    try {
      const umaPessoaInativa = await pessoasServices.pegaUmRegistroInativo(Number(id))
      return res.status(200).json(umaPessoaInativa)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async criaPessoa(req, res) {
    const novaPessoa = req.body
    try {
      await pessoasServices.criaRegistro(novaPessoa)
      return res.status(200).json('O novo usuário foi criado com sucesso!')
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async atualizaPessoa(req, res) {
    const { id } = req.params
    const novasInfos = req.body
    try {
      await pessoasServices.atualizaQualquerPessoa(novasInfos, Number(id))
      return res.status(200).json({ message: `O id ${id} foi atualizado com sucesso!`})
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async apagaPessoa(req, res) {
    const { id } = req.params
    try {
      await pessoasServices.softDeletePessoa(Number(id))
      return res.status(200).json({ mensagem: `id ${id} deletado` })
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async restauraPessoa(req, res) {
    const { id } = req.params
    try {
      await pessoasServices.restauraRegistro(Number(id))
      return res.status(200).json(`O id ${id} foi restaurado com sucesso!`)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async hardDeletePessoa(req, res) {
    const { id } = req.params
    try {
      await pessoasServices.hardDelete(Number(id))
      return res.status(200).json({ message: `id ${id} foi deletado permanentemente`})
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async pegaMatriculas(req, res) {
    const { estudanteId } = req.params
    try {
      const matriculas = await pessoasServices.pegaMatriculasPorEstudante({ id: Number(estudanteId) })
      return res.status(200).json(matriculas)

    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async cancelaPessoa(req, res) {
    const { estudanteId } = req.params
    try {
      await pessoasServices.cancelaPessoaEMatriculas(Number(estudanteId))
      return res.status(200).json({ message: `As matrículas referentes ao estudante ${estudanteId} foram canceladas.`})
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

}

module.exports = PessoaController