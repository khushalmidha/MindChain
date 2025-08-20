import { Router } from 'express'
import Transaction from '../model/Transaction.js'
import User from '../model/User.js'
import Workshop from '../model/WorkShop.js'
const router = Router()
router.post('/workshop', async (req, res) => {
  try {
    const { transactionHash, workshopId, address, amount, token } = req.body
    if (!transactionHash || !workshopId) {
      return res
        .status(400)
        .json({ message: 'Transaction hash and type are required' })
    }

    const type = 'workshop'
    const workshop = await Workshop.findById(workshopId)
    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' })
    }
    const recieverAddress = workshop.owner
    const recieverShare = Math.round((Number(amount) * 0.8)*100)/100;
    const user = await User.findOne({ walletAddress: address })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const reciever = await User.findOne({ walletAddress: recieverAddress })
    if (!reciever) {
      return res.status(404).json({ message: 'Reciever not found' })
    }
    const transaction = new Transaction({
      transactionHash,
      type,
      token: workshop.title || 'Workshop',
      workshop: workshopId,
      amount: Number(amount),
      transactionType: 'debit',
    })
    user.transactions.push(transaction._id)
    if (token && Number(token) > 0) {
      const tokenTransaction = new Transaction({
        transactionHash,
        type: 'token',
        token:'Tokens Redeemed',
        amount: Number(token),
        transactionType: 'debit',
      })
      await tokenTransaction.save()
      user.transactions.push(tokenTransaction._id)
    }
    user.purchasedWorkshops.push(workshopId);
    const recieverTransaction = new Transaction({
        transactionHash,
        type,
        token: workshop.title || 'Workshop',
        workshop: workshopId,
        amount: Number(recieverShare),
        transactionType: 'credit',
    })
    reciever.transactions.push(recieverTransaction._id);
    await reciever.save();
    await user.save();
    await transaction.save();
    await recieverTransaction.save();
    console.log(transaction,recieverTransaction,user)
    res.status(201).json({ transaction, workshop, user })
  } catch (error) {
    console.error('Error creating transaction:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.post('/token', async (req, res) => {
  try {
    const { transactionHash, token, address } = req.body
    if (!transactionHash) {
      return res.status(400).json({ message: 'Transaction hash is required' })
    }
    const type = 'token'
    const transaction = new Transaction({ transactionHash, type, token, amount:10,transactionType: 'credit' })
    await transaction.save()
    const user = await User.findOne({ walletAddress: address })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    user.transactions.push(transaction._id)
    await user.save()
    res.status(201).json({transaction,user});
  } catch (error) {
    console.error('Error creating transaction:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router
