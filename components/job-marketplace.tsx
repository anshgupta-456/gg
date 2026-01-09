"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Users,
  Code,
  Video,
  Gamepad2,
  Filter,
  BookmarkPlus,
  ExternalLink,
  Trophy,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const jobListings: Job[] = [
  {
    id: 1,
    title: "Senior Game Developer",
    company: "Epic Games",
    location: "Remote",
    type: "Full-time",
    salary: "$120k - $180k",
    posted: "2 days ago",
    skills: ["Unity", "C#", "Game Design"],
    description: "Join our team to develop next-generation gaming experiences...",
    logo: "/placeholder-logo.png",
    fullDescription: "We are looking for an experienced Senior Game Developer to join our team and help create cutting-edge gaming experiences. You will work on exciting projects using Unity and C# to build games that millions of players will enjoy.",
    requirements: [
      "5+ years of experience in game development",
      "Strong proficiency in Unity and C#",
      "Experience with game design principles",
      "Portfolio demonstrating game development skills",
      "Strong problem-solving and communication skills"
    ],
    benefits: [
      "Competitive salary and equity",
      "Flexible remote work options",
      "Health, dental, and vision insurance",
      "401(k) matching",
      "Unlimited PTO",
      "Professional development opportunities"
    ]
  },
  {
    id: 2,
    title: "Esports Coach",
    company: "Team Liquid",
    location: "Los Angeles, CA",
    type: "Full-time",
    salary: "$80k - $120k",
    posted: "1 week ago",
    skills: ["League of Legends", "Strategy", "Leadership"],
    description: "Lead our professional League of Legends team to victory...",
    logo: "/placeholder-logo.png",
    fullDescription: "Team Liquid is seeking an experienced Esports Coach to lead our professional League of Legends team. You will be responsible for developing strategies, analyzing gameplay, and mentoring players to achieve competitive excellence.",
    requirements: [
      "High-level competitive experience in League of Legends",
      "Proven track record of coaching success",
      "Strong strategic understanding of the game",
      "Excellent leadership and communication skills",
      "Ability to work under pressure in competitive environments"
    ],
    benefits: [
      "Competitive salary package",
      "Travel opportunities for tournaments",
      "Health insurance",
      "Access to state-of-the-art training facilities",
      "Collaboration with world-class players"
    ]
  },
  {
    id: 3,
    title: "Content Creator",
    company: "Twitch",
    location: "Remote",
    type: "Contract",
    salary: "$50 - $100/hour",
    posted: "3 days ago",
    skills: ["Video Editing", "Streaming", "Social Media"],
    description: "Create engaging gaming content for our platform...",
    logo: "/placeholder-logo.png",
    fullDescription: "Twitch is looking for talented Content Creators to produce engaging gaming content. You'll create streams, videos, and social media content that resonates with gaming communities.",
    requirements: [
      "Proven experience in content creation",
      "Proficiency in video editing software",
      "Strong social media presence",
      "Excellent communication and presentation skills",
      "Knowledge of gaming trends and culture"
    ],
    benefits: [
      "Flexible schedule",
      "Competitive hourly rate",
      "Creative freedom",
      "Access to latest gaming equipment",
      "Potential for full-time conversion"
    ]
  },
  {
    id: 4,
    title: "UI/UX Designer - Gaming",
    company: "Riot Games",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$100k - $140k",
    posted: "5 days ago",
    skills: ["Figma", "UI Design", "User Research"],
    description: "Design intuitive interfaces for millions of players...",
    logo: "/placeholder-logo.png",
    fullDescription: "Riot Games is seeking a talented UI/UX Designer to create intuitive and engaging interfaces for our games. You'll work closely with game designers and developers to create user experiences that millions of players will enjoy.",
    requirements: [
      "3+ years of UI/UX design experience",
      "Proficiency in Figma and design tools",
      "Strong portfolio demonstrating design skills",
      "Experience with user research and testing",
      "Passion for gaming and understanding of player needs"
    ],
    benefits: [
      "Competitive salary",
      "Comprehensive health benefits",
      "Stock options",
      "On-site amenities (gym, meals, etc.)",
      "Collaborative and creative work environment"
    ]
  },
  {
    id: 5,
    title: "Community Manager",
    company: "Discord",
    location: "Remote",
    type: "Full-time",
    salary: "$70k - $90k",
    posted: "1 week ago",
    skills: ["Community Building", "Social Media", "Communication"],
    description: "Build and manage gaming communities on our platform...",
    logo: "/placeholder-logo.png",
    fullDescription: "Discord is looking for a Community Manager to build and nurture gaming communities on our platform. You'll engage with users, create content, and help shape the future of gaming communication.",
    requirements: [
      "2+ years of community management experience",
      "Strong social media and communication skills",
      "Understanding of gaming communities",
      "Experience with community engagement tools",
      "Creative content creation abilities"
    ],
    benefits: [
      "Remote work flexibility",
      "Competitive salary",
      "Health and wellness benefits",
      "Learning and development budget",
      "Access to Discord Nitro"
    ]
  },
  {
    id: 6,
    title: "Professional Gamer",
    company: "FaZe Clan",
    location: "Various",
    type: "Contract",
    salary: "Competitive",
    posted: "4 days ago",
    skills: ["FPS Games", "Competitive Gaming", "Streaming"],
    description: "Compete at the highest level in professional esports...",
    logo: "/placeholder-logo.png",
    fullDescription: "FaZe Clan is recruiting top-tier professional gamers to represent our brand in competitive esports. Join an elite team and compete in major tournaments while building your personal brand.",
    requirements: [
      "Proven competitive gaming achievements",
      "High skill level in FPS games",
      "Strong streaming and content creation abilities",
      "Professional attitude and work ethic",
      "Ability to travel for tournaments"
    ],
    benefits: [
      "Competitive salary and tournament winnings",
      "Brand sponsorships and partnerships",
      "Travel and accommodation for events",
      "Content creation support",
      "Access to professional gaming equipment"
    ]
  },
]

const jobCategories = [
  { name: "Game Development", count: 45, icon: Code },
  { name: "Esports", count: 23, icon: Trophy },
  { name: "Content Creation", count: 67, icon: Video },
  { name: "Community Management", count: 34, icon: Users },
  { name: "Game Design", count: 28, icon: Gamepad2 },
  { name: "Marketing", count: 19, icon: Briefcase },
]

const featuredCompanies = [
  { name: "Epic Games", jobs: 12, logo: "/placeholder-logo.png" },
  { name: "Riot Games", jobs: 8, logo: "/placeholder-logo.png" },
  { name: "Blizzard", jobs: 15, logo: "/placeholder-logo.png" },
  { name: "Valve", jobs: 6, logo: "/placeholder-logo.png" },
]

const myApplications = [
  {
    id: 1,
    title: "Senior Game Developer",
    company: "Epic Games",
    status: "Under Review",
    appliedDate: "2024-01-08",
    logo: "/placeholder-logo.png",
  },
  {
    id: 2,
    title: "Esports Coach",
    company: "Team Liquid",
    status: "Interview Scheduled",
    appliedDate: "2024-01-05",
    logo: "/placeholder-logo.png",
  },
  {
    id: 3,
    title: "Content Creator",
    company: "Twitch",
    status: "Rejected",
    appliedDate: "2024-01-03",
    logo: "/placeholder-logo.png",
  },
]

interface Job {
  id: number
  title: string
  company: string
  location: string
  type: string
  salary: string
  posted: string
  skills: string[]
  description: string
  logo?: string
  fullDescription?: string
  requirements?: string[]
  benefits?: string[]
}

export function JobMarketplace() {
  const { toast } = useToast()
  const [appliedJobs, setAppliedJobs] = useState<number[]>([])
  const [savedJobs, setSavedJobs] = useState<number[]>([])
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [applicationOpen, setApplicationOpen] = useState(false)
  const [applicationForm, setApplicationForm] = useState({
    name: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: "",
  })
  const [submitting, setSubmitting] = useState(false)

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Job Marketplace</h1>
          <p className="text-gray-400">Find your dream job in the gaming industry</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => toast({ title: "Feature Coming Soon!", description: "Job posting will be available in a future update." })}>
          <Briefcase className="w-4 h-4 mr-2" />
          Post a Job
        </Button>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="browse">Browse Jobs</TabsTrigger>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search jobs, companies, or skills..."
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <select className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
              <option>All Locations</option>
              <option>Remote</option>
              <option>San Francisco, CA</option>
              <option>Los Angeles, CA</option>
              <option>New York, NY</option>
            </select>
            <select className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
              <option>All Types</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
            <Button variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Job Categories Sidebar */}
            <div className="space-y-6">
              <Card className="bg-gray-800 border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Job Categories</h3>
                <div className="space-y-3">
                  {jobCategories.map((category) => {
                    const Icon = category.icon
                    return (
                      <div
                        key={category.name}
                        className="flex items-center justify-between cursor-pointer hover:bg-gray-700 p-2 rounded"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-4 h-4 text-purple-400" />
                          <span className="text-gray-300 text-sm">{category.name}</span>
                        </div>
                        <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                          {category.count}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </Card>

              <Card className="bg-gray-800 border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Featured Companies</h3>
                <div className="space-y-3">
                  {featuredCompanies.map((company) => (
                    <div
                      key={company.name}
                      className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded"
                    >
                      <img src={company.logo || "/placeholder-logo.png"} alt={company.name} className="w-8 h-8 rounded" />
                      <div>
                        <div className="text-white text-sm font-medium">{company.name}</div>
                        <div className="text-gray-400 text-xs">{company.jobs} open positions</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Job Listings */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Showing {jobListings.length} jobs</span>
                <select className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm">
                  <option>Most Recent</option>
                  <option>Salary: High to Low</option>
                  <option>Salary: Low to High</option>
                  <option>Most Relevant</option>
                </select>
              </div>

              {jobListings.map((job) => (
                <Card
                  key={job.id}
                  className="bg-gray-800 border-gray-700 p-6 hover:border-purple-600 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-4">
                      <img src={job.logo || "/placeholder-logo.png"} alt={job.company} className="w-12 h-12 rounded" />
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">{job.title}</h3>
                        <p className="text-purple-400 font-medium mb-2">{job.company}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Briefcase className="w-4 h-4" />
                            <span>{job.type}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4" />
                            <span>{job.salary}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{job.posted}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <BookmarkPlus className="w-4 h-4" />
                    </Button>
                  </div>

                  <p className="text-gray-300 mb-4">{job.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="bg-gray-700 text-gray-300">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-gray-600 text-gray-300 bg-transparent"
                        onClick={() => {
                          setSelectedJob(job)
                          setDetailsOpen(true)
                        }}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 flex-1"
                        disabled={appliedJobs.includes(job.id)}
                        onClick={() => {
                          setSelectedJob(job)
                          setApplicationOpen(true)
                        }}
                      >
                        {appliedJobs.includes(job.id) ? "Applied" : "Apply"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300 flex-1"
                        disabled={savedJobs.includes(job.id)}
                        onClick={() => {
                          setSavedJobs((prev) => [...prev, job.id])
                          toast({ title: "Job Saved!", description: `You saved ${job.title} at ${job.company}.` })
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              <div className="text-center py-8">
                <Button variant="outline" className="border-gray-600 text-gray-300 bg-transparent">
                  Load More Jobs
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">My Applications</h3>
            <div className="flex space-x-2">
              <select className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm">
                <option>All Status</option>
                <option>Under Review</option>
                <option>Interview Scheduled</option>
                <option>Rejected</option>
                <option>Accepted</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {myApplications.map((application) => (
              <Card key={application.id} className="bg-gray-800 border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={application.logo || "/placeholder-logo.png"}
                      alt={application.company}
                      className="w-12 h-12 rounded"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-white">{application.title}</h3>
                      <p className="text-purple-400">{application.company}</p>
                      <p className="text-gray-400 text-sm">Applied on {application.appliedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge
                      className={`${
                        application.status === "Under Review"
                          ? "bg-yellow-600"
                          : application.status === "Interview Scheduled"
                            ? "bg-blue-600"
                            : application.status === "Rejected"
                              ? "bg-red-600"
                              : "bg-green-600"
                      }`}
                    >
                      {application.status}
                    </Badge>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 bg-transparent">
                      View Application
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <div className="text-center py-12">
            <BookmarkPlus className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Saved Jobs Yet</h3>
            <p className="text-gray-400 mb-4">Save jobs you're interested in to easily find them later</p>
            <Button className="bg-purple-600 hover:bg-purple-700">Browse Jobs</Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Job Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedJob?.title}</DialogTitle>
            <DialogDescription className="text-purple-400">
              {selectedJob?.company} • {selectedJob?.location}
            </DialogDescription>
          </DialogHeader>
          
          {selectedJob && (
            <div className="space-y-6 mt-4">
              <div className="flex items-start space-x-4 pb-4 border-b border-gray-700">
                <img src={selectedJob.logo || "/placeholder-logo.png"} alt={selectedJob.company} className="w-16 h-16 rounded-lg" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{selectedJob.title}</h3>
                  <p className="text-purple-400 font-medium mb-3">{selectedJob.company}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                    <span className="flex items-center space-x-1"><MapPin className="w-4 h-4" /><span>{selectedJob.location}</span></span>
                    <span className="flex items-center space-x-1"><Briefcase className="w-4 h-4" /><span>{selectedJob.type}</span></span>
                    <span className="flex items-center space-x-1"><DollarSign className="w-4 h-4" /><span>{selectedJob.salary}</span></span>
                    <span className="flex items-center space-x-1"><Clock className="w-4 h-4" /><span>Posted {selectedJob.posted}</span></span>
                  </div>
                </div>
              </div>
              
              <div><h4 className="text-lg font-semibold mb-3">Job Description</h4><p className="text-gray-300 leading-relaxed">{selectedJob.fullDescription || selectedJob.description}</p></div>
              
              {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                <div><h4 className="text-lg font-semibold mb-3">Requirements</h4><ul className="list-disc list-inside space-y-2 text-gray-300">{selectedJob.requirements.map((req, idx) => (<li key={idx}>{req}</li>))}</ul></div>
              )}
              
              {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                <div><h4 className="text-lg font-semibold mb-3">Benefits & Perks</h4><ul className="list-disc list-inside space-y-2 text-gray-300">{selectedJob.benefits.map((benefit, idx) => (<li key={idx}>{benefit}</li>))}</ul></div>
              )}
              
              <div><h4 className="text-lg font-semibold mb-3">Required Skills</h4><div className="flex flex-wrap gap-2">{selectedJob.skills.map((skill) => (<Badge key={skill} variant="secondary" className="bg-purple-900/30 text-purple-300 border-purple-700">{skill}</Badge>))}</div></div>
              
              <div className="flex space-x-3 pt-4 border-t border-gray-700">
                <Button className="bg-purple-600 hover:bg-purple-700 flex-1" disabled={appliedJobs.includes(selectedJob.id)} onClick={() => { setDetailsOpen(false); setApplicationOpen(true); }}>
                  {appliedJobs.includes(selectedJob.id) ? "Already Applied" : "Apply Now"}
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 flex-1" onClick={() => { if (savedJobs.includes(selectedJob.id)) { setSavedJobs((prev) => prev.filter(id => id !== selectedJob.id)); toast({ title: "Job Removed", description: `Removed ${selectedJob.title} from saved jobs.` }); } else { setSavedJobs((prev) => [...prev, selectedJob.id]); toast({ title: "Job Saved!", description: `Saved ${selectedJob.title} to your list.` }); } }}>
                  {savedJobs.includes(selectedJob.id) ? "Unsave" : "Save Job"}
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300" onClick={() => setDetailsOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Job Application Form Dialog */}
      <Dialog open={applicationOpen} onOpenChange={setApplicationOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-2xl">Apply for {selectedJob?.title}</DialogTitle><DialogDescription className="text-purple-400">{selectedJob?.company} • {selectedJob?.location}</DialogDescription></DialogHeader>
          {selectedJob && (
            <form onSubmit={async (e) => { e.preventDefault(); setSubmitting(true); await new Promise(resolve => setTimeout(resolve, 1500)); setAppliedJobs((prev) => [...prev, selectedJob.id]); setApplicationForm({ name: "", email: "", phone: "", coverLetter: "", resume: "" }); setApplicationOpen(false); setSubmitting(false); toast({ title: "Application Submitted! ✅", description: `Your application for ${selectedJob.title} at ${selectedJob.company} has been submitted successfully. We'll be in touch soon!`, }); }} className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="name" className="text-gray-300">Full Name *</Label><Input id="name" required value={applicationForm.name} onChange={(e) => setApplicationForm({ ...applicationForm, name: e.target.value })} className="bg-gray-700 border-gray-600 text-white" placeholder="John Doe" /></div>
                <div className="space-y-2"><Label htmlFor="email" className="text-gray-300">Email Address *</Label><Input id="email" type="email" required value={applicationForm.email} onChange={(e) => setApplicationForm({ ...applicationForm, email: e.target.value })} className="bg-gray-700 border-gray-600 text-white" placeholder="john@example.com" /></div>
              </div>
              <div className="space-y-2"><Label htmlFor="phone" className="text-gray-300">Phone Number</Label><Input id="phone" type="tel" value={applicationForm.phone} onChange={(e) => setApplicationForm({ ...applicationForm, phone: e.target.value })} className="bg-gray-700 border-gray-600 text-white" placeholder="+1 (555) 123-4567" /></div>
              <div className="space-y-2"><Label htmlFor="resume" className="text-gray-300">Resume / Portfolio Link *</Label><Input id="resume" required value={applicationForm.resume} onChange={(e) => setApplicationForm({ ...applicationForm, resume: e.target.value })} className="bg-gray-700 border-gray-600 text-white" placeholder="https://yourportfolio.com or resume.pdf" /></div>
              <div className="space-y-2"><Label htmlFor="coverLetter" className="text-gray-300">Cover Letter *</Label><Textarea id="coverLetter" required value={applicationForm.coverLetter} onChange={(e) => setApplicationForm({ ...applicationForm, coverLetter: e.target.value })} className="bg-gray-700 border-gray-600 text-white min-h-[150px]" placeholder="Tell us why you're the perfect fit for this position..." /><p className="text-xs text-gray-400">Explain your interest in this role and relevant experience (minimum 100 characters)</p></div>
              <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-4"><p className="text-sm text-gray-300">By submitting this application, you agree to our privacy policy. Your information will be shared with {selectedJob.company} for recruitment purposes.</p></div>
              <div className="flex space-x-3 pt-4 border-t border-gray-700">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 flex-1" disabled={submitting || appliedJobs.includes(selectedJob.id)}>{submitting ? "Submitting..." : appliedJobs.includes(selectedJob.id) ? "Already Applied" : "Submit Application"}</Button>
                <Button type="button" variant="outline" className="border-gray-600 text-gray-300" onClick={() => setApplicationOpen(false)} disabled={submitting}>Cancel</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
