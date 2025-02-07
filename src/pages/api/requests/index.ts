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

  switch (req.method) {
    case 'GET':
      try {
        const requests = await Request.find({ userId: decoded.id })
          .sort({ createdAt: -1 });
        res.status(200).json(requests);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching requests' });
      }
      break;

    case 'POST':
      try {
        const request = await Request.create({
          ...req.body,
          userId: decoded.id
        });
        res.status(201).json(request);
      } catch (error) {
        res.status(500).json({ message: 'Error creating request' });
      }
      break;

    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
}