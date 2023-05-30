const { Op } = require('sequelize')
const database = require('../models')
const Sequelize = require('sequelize')

class PessoaController {
  static async pegaPessoasAtivas(req, res){
    try {
      const pessoasAtivas = await database.Pessoas.findAll()
      return res.status(200).json(pessoasAtivas)  
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }
  
  static async pegaTodasAsPessoas(req, res){
    try {
      const todasAsPessoas = await database.Pessoas.scope('todos').findAll()
      return res.status(200).json(todasAsPessoas)  
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async consultaTodasAsPessoasApagadas(req, res) {
    try{
      const todasAsPessoasApagadas = await database.Pessoas.scope('todos').findAll({ 
        paranoid: false,
        where: {
          deletedAt: { [Op.not]: null }
        }
      })
      return res.status(200).json(todasAsPessoasApagadas)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async pegaUmaPessoa(req, res) {
    const { id } = req.params
    try {
      const umaPessoa = await database.Pessoas.findOne( { 
        where: { 
          id: Number(id) 
        }
      })
      return res.status(200).json(umaPessoa)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }
  
  static async consultaPessoaApagada(req, res) {
    const { id } = req.params
    try {
      const umaPessoaApagada = await database.Pessoas.scope('todos').findOne({
        paranoid: false,
        where: { 
          id: Number(id),
          deleteAt: { [Op.not]: null }
        }
      })
      return res.status(200).json(umaPessoaApagada)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async criaPessoa(req, res) {
    const novaPessoa = req.body
    try {
      const novaPessoaCriada = await database.Pessoas.create(novaPessoa)
      return res.status(200).json(novaPessoaCriada)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async atualizaPessoa(req, res) {
    const { id } = req.params
    const novasInfos = req.body
    try {
      await database.Pessoas.scope('todos').update(novasInfos, { where: { id: Number(id) }})
      const pessoaAtualizada = await database.Pessoas.findOne( { where: { id: Number(id) }})
      return res.status(200).json(pessoaAtualizada)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async apagaPessoa(req, res) {
    const { id } = req.params
    try {
      await database.Pessoas.scope('todos').destroy({ where: { id: Number(id) }})
      return res.status(200).json({ mensagem: `id ${id} deletado` })

    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async restauraPessoa(req, res) {
    const { id } = req.params
    try {
      await database.Pessoas.scope('todos').restore( {where: { id: Number(id) } })
      return res.status(200).json({ message: `id ${id} restaurado`})
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async hardDeletePessoa(req, res) {
    const { id } = req.params
    try {
      await database.Pessoas.scope('todos').destroy({
        where: {
          id: Number(id)
        },
        force: true
      })
      return res.status(200).json({ message: `id ${id} foi deletado permanentemente`})
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async pegaUmaMatricula(req, res) {
    const { estudanteId, matriculaId } = req.params
    try {
      const umaMatricula = await database.Matriculas.findOne( { 
        where: { 
          id: Number(matriculaId),
          estudante_id: Number(estudanteId)
        }
      })
      return res.status(200).json(umaMatricula)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async criaMatricula(req, res) {
    const { estudanteId } = req.params
    const novaMatricula = { ...req.body, estudante_id: Number(estudanteId) }
    try {
      const novaMatriculaCriada = await database.Matriculas.create(novaMatricula)
      return res.status(200).json(novaMatriculaCriada)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async atualizaMatricula(req, res) {
    const { estudanteId, matriculaId } = req.params
    const novasInfos = req.body
    try {
      await database.Matriculas.update(novasInfos, { 
        where: { 
          id: Number(matriculaId),
          estudante_id: Number(estudanteId) 
        }})
      const MatriculaAtualizada = await database.Matriculas.findOne( { where: { id: Number(matriculaId) }})
      return res.status(200).json(MatriculaAtualizada)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async apagaMatricula(req, res) {
    const { matriculaId } = req.params
    try {
      await database.Matriculas.destroy({ where: { id: Number(matriculaId) }})
      return res.status(200).json({ mensagem: `id ${matriculaId} deletado` })

    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async restauraMatricula(req, res) {
    const { estudanteId, matriculaId } = req.params
    try {
      await database.Matriculas.restore({
        where: {
          id: Number(matriculaId),
          estudante_id: Number(estudanteId)
        }
      })
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async pegaMatriculas(req, res) {
    const { estudanteId } = req.params
    try {
      // const matriculas = await database.Matriculas.findAll({ where: { estudante_id: Number(estudanteId) }})
      const pessoa = await database.Pessoas.findOne( { where: { id: Number(estudanteId) }})
      const matriculas = await pessoa.getAulasMatriculadas()
      return res.status(200).json(matriculas)

    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async pegaMatriculasPorTurma(req, res) {
    const { turmaId } = req.params
    try {
      const todasAsMatriculas = await database.Matriculas
        .findAndCountAll({
          where: {
            turma_id: Number(turmaId),
            status: 'confirmado'
          },
          limit: 20,                        // Limita a quantidade de resultados a serem dados como resposta
          order: [['estudante_id', 'DESC']] // Define a ordem de exibição, conforme parâmetro dado e se é ASC ou DESC
        })
      return res.status(200).json(todasAsMatriculas)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async pegaTurmasLotadas(req, res) {
    const lotacaoTurma = 2
    try {
      const turmasLotadas = await database.Matriculas
        .findAndCountAll({
          where: {
            status: 'confirmado'
          },
          attributes: ['turma_id'],
          group: ['turma_id'],
          having: Sequelize.literal(`count(turma_id) >= ${lotacaoTurma}`)
        })
      return res.status(200).json(turmasLotadas.count)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async cancelaPessoa(req, res) {
    const { estudanteId } = req.params
    try {
      database.sequelize.transaction(async transacao => {
        await database.Pessoas
          .update({ ativo: false }, { where: { id: Number(estudanteId)}}, { transaction: transacao })
        await database.Matriculas
          .update( { status: 'cancelado'}, { where: { estudante_id: Number(estudanteId)}}, { transaction: transacao })
        return res.status(200).json({ message: `As matrículas referentes ao estudante ${estudanteId} foram canceladas.`})
      })
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

}

module.exports = PessoaController