import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import Request from '@/models/Request';
import { verifyToken } from '@/services/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const request = await Request.findOne({ _id: id, userId: decoded.id });
        if (!request) {
          return res.status(404).json({ message: 'Request not found' });
        }
        res.status(200).json(request);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching request' });
      }
      break;

    case 'PUT':
      try {
        const request = await Request.findOneAndUpdate(
          { _id: id, userId: decoded.id },
          req.body,
          { new: true }
        );
        if (!request) {
          return res.status(404).json({ message: 'Request not found' });
        }
        res.status(200).json(request);
      } catch (error) {
        res.status(500).json({ message: 'Error updating request' });
      }
      break;

    case 'DELETE':
      try {
        const request = await Request.findOneAndDelete({ _id: id, userId: decoded.id });
        if (!request) {
          return res.status(404).json({ message: 'Request not found' });
        }
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ message: 'Error deleting request' });
      }
      break;

    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
}