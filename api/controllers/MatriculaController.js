const Sequelize = require('sequelize')
const { MatriculasServices } = require('../services')
const matriculasServices = new MatriculasServices()

class MatriculaController {
  static async pegaUmaMatricula(req, res) {
    const { estudanteId, matriculaId } = req.params
    try {
      const umaMatricula = await matriculasServices
        .pegaUmRegistro({id: Number(matriculaId), estudante_id: Number(estudanteId)})
      return res.status(200).json(umaMatricula)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async criaMatricula(req, res) {
    const { estudanteId } = req.params
    const novaMatricula = { ...req.body, estudante_id: Number(estudanteId) }
    try {
      await matriculasServices.criaRegistro(novaMatricula)
      return res.status(200).json(`Foi criada com sucesso uma nova matrícula para o usuário ${estudanteId}.`)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async atualizaMatricula(req, res) {
    const { estudanteId, matriculaId } = req.params
    const novasInfos = req.body
    try {
      await matriculasServices.atualizaRegistros(novasInfos, {id: Number(matriculaId), estudante_id: Number(estudanteId)})
      return res.status(200).json({ message: `A matrícula de id ${matriculaId}, do usuário ${estudanteId}, foi atualizada com sucesso.` })
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async apagaMatricula(req, res) {
    const { matriculaId } = req.params
    try {
      await matriculasServices.apagaRegistro(Number(matriculaId))
      return res.status(200).json({ message: `A matrícula de id ${matriculaId} foi deletada com sucesso.` })
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async restauraMatricula(req, res) {
    const { matriculaId } = req.params
    try {
      await matriculasServices.restauraRegistro(Number(matriculaId))
      return res.status(200).json({ message: `A matrícula de id ${matriculaId} foi restaurada com sucesso.`})
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async pegaMatriculasPorTurma(req, res) {
    const { turmaId } = req.params
    try {
      const todasAsMatriculas = await matriculasServices.encontraEContaRegistros(
        { turma_id: Number(turmaId), status: 'confirmado' },
        { limit: 20, order: [['estudante_id', 'DESC']] }
      )
      return res.status(200).json(todasAsMatriculas)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async pegaTurmasLotadas(req, res) {
    const lotacaoTurma = 2
    try {
      const turmasLotadas = await matriculasServices
        .encontraEContaRegistros({ status: 'confirmado'},
          { 
            attributes: ['turma_id'], 
            group: ['turma_id'], 
            having: Sequelize.literal(`count(turma_id) >= ${lotacaoTurma}`) 
          }
        )
      return res.status(200).json(turmasLotadas.count)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }
}

module.exports = MatriculaController
