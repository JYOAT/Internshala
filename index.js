const express = require('express');
const prisma = require('./db');
const app = express();
const PORT = 3000;


// Middleware to parse JSON
app.use(express.json());

// Routes
app.post('/api/agents', async (req, res) => {
    try {
        const body = req.body;

        // Validate required fields
        if (!body.name || !body.language ) {
            return res.status(400).json({ error: "All fields are required: name, language, voiceId, updatedAt" });
        }

        // Create agent in the database
        const agent = await prisma.agent.create({
            data: {
                name: body.name,
                language: body.language,
                voiceId : body.voiceId,
                updatedAt : body.updatedAt
            },
        });

        // Send the created agent as the response
        return res.status(201).json({
            agent_detail: agent,
        });
    } catch (error) {
        console.error("Error creating agent:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/api/agents' , async(req, res)=>{
    const agents = await prisma.agent.findMany();
    res.status(200).json({
        data: agents,
    });

})

app.put('/api/agents/:id', async(req, res)=>{
    const agentid = Number(req.params.id);
    const body = req.body;
    if (!agentid){
        res.status(400).json({
            error : "Invalid id"
        })
    }
    
    const updateDetails = await prisma.agent.update({
        where:{
            id : agentid
        },
        data:{
            language : body.language,
                        
        }
    })

    res.status(200).json({
        id : updateDetails.id
    })

})
app.delete('/api/agents/:id' , async (req,res)=>{
    const agentid = Number(req.params.id);

    if (!agentid){
        res.status(400).json({
            error : "Invalid id"
        })
    }

    const removeAgent = await prisma.agent.delete({
        where:{
            id: agentid
        }

    })
    res.json({
        removeAgent
    })

})


app.post('/api/campaigns' , async(req,res)=>{
    try{
        const body = req.body;
        const campaign = await prisma.campaign.create({
            data:{
                name: body.name,
                type : "Inbound",
                phoneNo: body.phoneNo,
                status : "Running",
                agentId : Number( body.agentId)
            }
        })

        res.status(200).json({
            campaign: campaign
        })


    }catch(e){
        console.log(e);
        res.status(500).json({
           message:  "error while adding campaign"
        })
    }
})

app.get('/api/campaigns', async(req,res)=>{
    const campaigns = await prisma.campaign.findMany();
    res.json({
        campaigns: campaigns
    })
})

app.put('/api/campaigns/:id' , async(req,res)=>{
    try{

        const campaignId = req.params.id;
        const body= req.body;
        if (!campaignId){
            res.status(400).json({
                message: "Invalid id"
            })

        }
        const updateCampaign = await prisma.campaign.update({
            where:{
                id :Number(campaignId),

            },
            data:{
                name: body.name,
                phoneNo: body.phoneNo,
                

            }



        })

        res.json({
            campaignId
        })
     }catch(e){
        console.log(e);
        return res.status(400).json({
            message:"Error while updating campaign details"
        })
     }
    
})
app.delete('/api/campaigns/:id' , async (req,res)=>{
    const campaignId = Number(req.params.id);

    if (!campaignId){
        res.status(400).json({
            error : "Invalid id"
        })
    }

    const removeCampaign = await prisma.campaign.delete({
        where:{
            id: campaignId
        }

    })
    res.json({
        removeCampaign
    })

})

app.post('/api/campaigns/:id/results' , async (req,res)=>{
    try{
        
        const body = req.body;
        const result = await prisma.result.create({
            data:{
                name : body.name,
                type : body.type,
                cost : parseFloat(body.cost),
                outcome : body.outcome,
                duration : parseFloat(body.duration),
                summary  : body.summary,
                transcription : body.transcription,
                campaignId: Number(req.params.id)


            }
        })
        res.status(200).json({
            result : result
        })

    }catch(e){
        console.log(e);
        res.json({
            message :"Error while adding result"
        })
    }
})
app.get('/api/campaigns/:id/results' , async (req,res)=>{
    const id = Number(req.params.id);
    if(!id){
        res.status(400).json({
            message : "Invalid id"
        })
    }
    const results = await prisma.result.findMany({
        where:{
            campaignId : id
        }
    })

    res.json({
        results: results
    })


})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
