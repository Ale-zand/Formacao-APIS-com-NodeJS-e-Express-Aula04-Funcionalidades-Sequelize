const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { TurmasServices } = require('../services')
const turmasServices = new TurmasServices()

class TurmaController {
  // **** NÃO FUNCIONA AS QUERYS *****
  static async pegaTodasAsTurmas(req, res){
    const { data_inicial, data_final } = req.query
    const where = {}
    data_inicial || data_final ? where.data_inicio = {} : null
    data_inicial ? where.data_inicio[Op.gte] = data_inicial : null
    data_final ? where.data_inicio[Op.lte] = data_final : null
    try {
      const todasAsTurmas = await turmasServices.pegaTodosOsRegistros(where)
      return res.status(200).json(todasAsTurmas) 
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async pegaUmaTurma(req, res) {
    const { id } = req.params
    try {
      const umaTurma = await turmasServices.pegaUmRegistro({ id: Number(id) })
      return res.status(200).json(umaTurma)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async criaTurma(req, res) {
    const novaTurma = req.body
    try {
      await turmasServices.criaRegistro(novaTurma)
      return res.status(200).json({ message: 'Uma nova turma foi criada com sucesso!'})
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async atualizaTurma(req, res) {
    const { id } = req.params
    const novasInfos = req.body
    try {
      await turmasServices.atualizaRegistro(novasInfos, Number(id))
      return res.status(200).json({ message: `A turma de id ${id} foi atualizada com sucesso!`})
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async apagaTurma(req, res) {
    const { id } = req.params
    try {
      await turmasServices.apagaRegistro(Number(id))
      return res.status(200).json({ message: `A turma de id ${id} foi deletada com sucesso!` })

    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async restauraTurma(req, res) {
    const { id } = req.params
    try {
      await turmasServices.restauraRegistro(Number(id))
      return res.status(200).json({ message: `A turma de id ${id} foi restaurada com sucesso!`})
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

}

module.exports = TurmaController