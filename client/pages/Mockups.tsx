import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Mockups() {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">GUARD — UI Mockups</h1>

      {/* Community Forum Main */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Community Forum</CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Button variant="outline">Trending</Button>
                <Button variant="ghost">Newest</Button>
              </div>
              <Button className="bg-[#4F46E5] text-white">Create New Post</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {[
              { title: "Stay safe on mountain trails", category: "Safety Tips", author: "Amit S.", likes: 24, comments: 8 },
              { title: "Is it safe to travel alone?", category: "Q&A", author: "Priya R.", likes: 8, comments: 3 },
              { title: "Best offline maps for Himachal", category: "Tips", author: "Rohit V.", likes: 12, comments: 2 },
            ].map((p, i) => (
              <div key={i} className="flex items-start gap-4 rounded-lg bg-white p-4 shadow-md" style={{ borderRadius: 12 }}>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold text-[#111827]">{p.title}</div>
                      <div className="text-xs text-[#4B5563] mt-1">by {p.author} • <span className="inline-block bg-[#F3F4F6] text-[#4B5563] px-2 py-1 rounded">{p.category}</span></div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#4B5563]">
                      <div className="flex items-center gap-1">👍 <span className="font-medium">{p.likes}</span></div>
                      <div className="flex items-center gap-1">💬 <span className="font-medium">{p.comments}</span></div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-[#4B5563]">This is a short excerpt of the post to visualise card layout and spacing.</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Post Modal Mockup (visual only) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Create Post (Modal)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-2xl">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-[#111827]">Title</label>
                <Input placeholder="Enter a concise title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111827]">Category</label>
                <select className="w-full rounded-md border px-3 py-2">
                  <option>Safety Tips</option>
                  <option>Q&A</option>
                  <option>Guides</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111827]">Content</label>
                <Textarea className="h-40" placeholder="Write your post..." />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-[#4F46E5] text-white">Post</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Single Post View Mockup */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Single Post View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-md" style={{ borderRadius: 12 }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-semibold text-[#111827]">Stay safe on mountain trails</div>
                  <div className="text-xs text-[#4B5563]">by Amit S. • Safety Tips</div>
                </div>
                <div className="text-sm text-[#4B5563]">👍 24 • 💬 8</div>
              </div>
              <div className="mt-3 text-sm text-[#4B5563]">Full post content goes here. This area shows an example of longer post text with line breaks and paragraphs for readability.</div>
            </div>

            <div className="space-y-3">
              <div className="text-lg font-semibold">Comments</div>

              <div className="bg-white p-3 rounded-md shadow-sm">
                <div className="text-sm font-medium">Priya R. <span className="text-xs text-[#6B7280]">• 10m ago</span></div>
                <div className="text-sm text-[#4B5563] mt-1">Thanks for the tips! Any recommendations for safe trails for beginners?</div>
              </div>

              <div className="bg-white p-3 rounded-md shadow-sm">
                <div className="text-sm font-medium">Rohit V. <span className="text-xs text-[#6B7280]">• 2h ago</span></div>
                <div className="text-sm text-[#4B5563] mt-1">Use proper shoes and inform local guards. Also, check weather updates.</div>
              </div>

            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-Time Chat Mockup */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Chat with Guardian (Mockup)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="w-80 bg-white rounded-lg p-3 shadow-md flex flex-col" style={{ borderRadius: 12 }}>
              <div className="font-semibold">Chat with Tourist: Amit Sharma</div>
              <div className="flex-1 overflow-auto mt-3 space-y-3">
                <div className="text-sm text-[#4B5563] bg-[#F3F4F6] p-2 rounded-md max-w-[80%]">Hello Amit, are you safe?</div>
                <div className="text-sm self-end bg-[#4F46E5] text-white p-2 rounded-md max-w-[80%]">Yes, I'm on my way back.</div>
                <div className="text-sm text-[#4B5563] bg-[#F3F4F6] p-2 rounded-md max-w-[80%]">Do you need assistance?</div>
              </div>
              <div className="mt-3 flex gap-2">
                <Input placeholder="Type a message..." />
                <Button className="bg-[#4F46E5] text-white">Send</Button>
              </div>
            </div>

            <div className="flex-1">
              <div className="bg-white rounded-lg p-4 shadow-md" style={{ borderRadius: 12 }}>
                <div className="font-semibold">Conversation Details</div>
                <div className="text-sm text-[#4B5563] mt-2">Started: Today, 09:32 • Status: Active</div>
                <div className="mt-3 text-sm text-[#4B5563]"><strong>Location:</strong> City Center • <strong>ETA:</strong> 12 mins</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guardian Gamification: Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Guardian Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[{name:'Ramesh K', pts: 1240},{name:'Anita P', pts: 1120},{name:'Suresh D', pts:980}].map((g, i) => (
              <div key={i} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-[#4F46E5]">{i+1}</div>
                  <div>
                    <div className="font-semibold text-[#111827]">{g.name}</div>
                    <div className="text-xs text-[#6B7280]">Top responder</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-[#111827]">{g.pts} pts</div>
                  <div className="text-xs text-[#6B7280]">Primary Badge</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Guardian Badges Mockup */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Guardian Profile — Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-[#F3F4F6] flex items-center justify-center font-bold text-[#4F46E5]">RK</div>
            <div>
              <div className="font-semibold text-[#111827]">Ramesh Kumar</div>
              <div className="mt-2">
                <div className="text-sm font-medium">Badges</div>
                <div className="flex gap-2 mt-2">
                  <div className="bg-white p-3 rounded-md shadow-sm text-center" style={{ width:72 }}>
                    <div className="text-2xl">🏅</div>
                    <div className="text-xs text-[#6B7280] mt-1">First Responder</div>
                  </div>
                  <div className="bg-white p-3 rounded-md shadow-sm text-center" style={{ width:72 }}>
                    <div className="text-2xl">⭐</div>
                    <div className="text-xs text-[#6B7280] mt-1">Community Star</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
