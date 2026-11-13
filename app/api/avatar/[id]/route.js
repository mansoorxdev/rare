import { NextResponse } from 'next/server';
import { getAgentMetadata } from '../../../../lib/agentMetadata';

export async function GET(request, { params }) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = parseInt(resolvedParams?.id || '1', 10) || 1;
    const agent = getAgentMetadata(id);

    return NextResponse.redirect(new URL(agent.image || '/assets/agent/rare_front.jpg', request.url), 307);
  } catch (err) {
    return NextResponse.redirect(new URL('/assets/agent/rare_front.jpg', request.url), 307);
  }
}
