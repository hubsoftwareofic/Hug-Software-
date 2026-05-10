const router = require('express').Router()
const { supabaseAdmin } = require('../lib/supabase')
const authMiddleware = require('../middleware/auth')

// GET /api/church — retorna dados da igreja do usuário logado
router.get('/', authMiddleware, async (req, res) => {
  const { data: dbUser, error: userError } = await supabaseAdmin
    .from('db_user')
    .select('church_id')
    .eq('user_id', req.authUser.id)
    .single()

  if (userError || !dbUser?.church_id) {
    return res.status(404).json({ error: 'Igreja não encontrada' })
  }

  const { data: church, error } = await supabaseAdmin
    .from('db_church')
    .select('*')
    .eq('id', dbUser.church_id)
    .single()

  if (error || !church) {
    return res.status(404).json({ error: 'Igreja não encontrada' })
  }

  res.json({ church })
})

module.exports = router
