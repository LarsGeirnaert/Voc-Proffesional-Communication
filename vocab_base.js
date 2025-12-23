const vocabDatabase = [
    // UNIT 7: Ethics & Basics 
    // 1
    {id: 1, w: "reliability", d: "The quality of being able to be trusted or believed because of working or behaving well", u: 7},
    // 2
    {id: 2, w: "integrity", d: "The quality of being honest and having strong moral principles that you refuse to change", u: 7},
    // 3
    {id: 3, w: "diligence", d: "The quality of working carefully and with a lot of effort", u: 7},
    // 4
    {id: 4, w: "fairness", d: "The quality of treating people equally or in a way that is right or reasonable", u: 7},
    // 5
    {id: 5, w: "conscience", d: "The part of you that judges how moral your own actions are and makes you feel guilty about bad things that you have done", u: 7},
    // 6
    {id: 6, w: "preliminary", d: "Coming before a more important action or event", u: 7},
    // 7
    {id: 7, w: "complacency", d: "A feeling of calm satisfaction with your own abilities that prevents you from trying harder", u: 7},
    // 8
    {id: 8, w: "subsequent", d: "Happening after something else", u: 7},
    // 9
    {id: 9, w: "to adhere to", d: "To continue to obey a rule or have a belief/follow the practices", u: 7},
    // 10
    {id: 10, w: "to comply with", d: "To act according to an order, set of rules, or request", u: 7},
    // 11
    {id: 11, w: "disengagement", d: "The fact of stopping being involved in something", u: 7},
    // 12
    {id: 12, w: "to minimize", d: "To reduce something to the least possible level or amount", u: 7},
    // 13
    {id: 13, w: "median", d: "A narrow strip of land between two sides of a large road, separating the vehicles moving in opposite directions", u: 7},
    // 14
    {id: 14, w: "to rotate", d: "To turn around", u: 7},
    // 15
    {id: 15, w: "dark pattern", d: "Describing a user interface feature designed to trick users into doing something more beneficial to the company over the user", u: 7},
    // 16
    {id: 16, w: "terms of service", d: "A contract or agreement made between a company and the end-user using the product", u: 7},
    // 17
    {id: 17, w: "copyright", d: "A protection for any published work that helps to prevent that work from being used without prior authorization", u: 7
    },
    // 18
    {id: 18, w: "digital footprint", d: "Alternatively known as digital exhaust, describes activities that can be tracked when an individual uses the Internet", u: 7
    },
    // 19
    {id: 19, w: "malicious software", d: "This kind of software or computer programs are designed to damage other people's computers", u: 7
    },
    // 20
    {id: 20, w: "spyware", d: "Software that collects information about how someone uses the Internet without the user being aware of it", u: 7
    },
    // 21
    {id: 21, w: "trojan horse", d: "A seemingly harmless computer program that has been deliberately designed to breach the security of a computer system", u: 7
    },
    // 22
    {id: 22, w: "ransomware", d: "This disables the victim's access to data until ransom is paid", u: 7
    },
    // 23
    {id: 23, w: "adware", d: "Software that automatically displays or downloads (unwanted) advertisements to a user", u: 7
    },
    // UNIT 8: Censorship & Malware
    // 24
    {id: 24, w: "to spur", d: "To encourage an activity", u: 8},
    // 25
    {id: 25, w: "to outlaw", d: "To make something illegal or unacceptable", u: 8},
    // 26
    {id: 26, w: "deep packet inspection", d: "Method of examining the content of data packets as they pass by a checkpoint; used for censorship or security", u: 8},
    // 27
    {id: 27, w: "endorsement", d: "The act of saying that you approve of or support something or someone", u: 8},
    // 28
    {id: 28, w: "telcos", d: "Telecommunications companies", u: 8},
    // 29
    {id: 29, w: "to dub", d: "To give something or someone a particular name", u: 8},
    // 30
    {id: 30, w: "node", d: "A place where things such as lines or systems join", u: 8},
    // 31
    {id: 31, w: "encryption", d: "The process of changing electronic information or signals into a secret code", u: 8},
    // 32
    {id: 32, w: "to decode", d: "To discover the meaning of information given in a secret or complicated way", u: 8},
    // 33
    {id: 33, w: "to encode", d: "To change something into a system for sending messages secretly", u: 8},
    // 34
    {id: 34, w: "to intercept", d: "To stop and catch something or someone before that thing or person is able to reach a particular place", u: 8},
    // 35
    {id: 35, w: "unauthorized", d: "Without someone's official permission to do something or be in a particular place", u: 8},
    // 36
    {id: 36, w: "geo-blocking", d: "Technology that restricts access to internet content based upon the user's geographical location", u: 8},
    // 37
    {id: 37, w: "vpn", d: "Virtual Private Network - allows a user to connect through a tunnelling protocol", u: 8},
    // 38
    {id: 38, w: "to deploy", d: "To use something or someone, especially in an effective way", u: 8},
    // 39
    {id: 39, w: "to prohibit", d: "To officially refuse to allow something, to forbid something", u: 8},
    // 40
    {id: 40, w: "suppression", d: "The act of preventing something from being seen or expressed or from operating", u: 8},
    // 41
    {id: 41, w: "non-disclosure agreement", d: "An agreement a tester or developer signs with a company, committing them not to disclose any secrets (NDA)", u: 8},
    // 42
    {id: 42, w: "to outsource", d: "When a company pays to have part of its work done by another company", u: 8},
    // 43
    {id: 43, w: "to refute", d: "To say or prove that a person, statement, or opinion is wrong or false", u: 8},
    // 44
    {id: 44, w: "precedent", d: "An action or decision that has already happened and can be used as a reason why a similar action should be performed", u: 8},
    // 45
    {id: 45, w: "default", d: "The option offered to you, which is either recommended or safe to choose if you're not sure", u: 8},
    // 46
    {id: 46, w: "cryptography", d: "The practice and study of mathematically manipulating data so that it can be stored and transmitted securely", u: 8},
    // 47
    {id: 47, w: "blacklist", d: "A list of people or groups that are banned from something", u: 8},
    // 48
    {id: 48, w: "cancel culture", d: "A way of behaving where you completely reject and stop supporting someone because they have said or done something offensive", u: 8},
    // 49
    {id: 49, w: "to deplatform", d: "To prevent a person from contributing to a discussion or forum, especially on social media", u: 8},
    // 50
    {id: 50, w: "disinformation", d: "Misinformation that is deliberately misleading and intended to deceive", u: 8},
    // 51
    {id: 51, w: "liable", d: "Responsible by law", u: 8},
    // 52
    {id: 52, w: "shadow ban", d: "To block a user without their knowledge, so that they continue to see their own posts but nobody else does", u: 8},
    // 53
    {id: 53, w: "subjectivity", d: "The quality of being based on or influenced by personal opinions or feelings", u: 8},
    
    // UNIT 9: Monopoly
    // 54
    {id: 54, w: "monopoly", d: "An organization or group that has complete control of something", u: 9},
    // 55
    {id: 55, w: "provider", d: "A company that sells a particular type of product/service", u: 9},
    // 56
    {id: 56, w: "unprecedented", d: "Never having happened in the past", u: 9},
    // 57
    {id: 57, w: "to freeze somebody out", d: "To stop a person or organization from being included in a particular activity or arrangement", u: 9},
    // 58
    {id: 58, w: "third-party purchase", d: "A person other than the main participants buys something", u: 9},
    // 59
    {id: 59, w: "allegedly", d: "Used when something is said to be true that has not been proved", u: 9},
    // 60
    {id: 60, w: "core process", d: "An activity or operation that is part of the main business and therefore delivers customer value", u: 9},
    // 61
    {id: 61, w: "drawback", d: "A disadvantage", u: 9},
    // 62
    {id: 62, w: "machine learning", d: "Computers carry out tasks by learning from new data, without a human needing to give instructions", u: 9},
    // 63
    {id: 63, w: "to relay", d: "To repeat something you have heard", u: 9},
    // 64
    {id: 64, w: "usury", d: "Activity of lending someone money with the agreement that they will pay back a very much larger amount", u: 9},
    // 65
    {id: 65, w: "commission", d: "A payment to someone who sells goods that is directly related to the amount sold", u: 9},
    // 66
    {id: 66, w: "protocol", d: "A computer language allowing computers that are connected to each other to communicate", u: 9},
    // 67
    {id: 67, w: "domain", d: "A group of computers or websites that are organised by purpose", u: 9},
    // 68
    {id: 68, w: "subscription", d: "Amount of money you pay regularly to receive a product or service", u: 9},
    // 69
    {id: 69, w: "duopoly", d: "A situation in which only two companies control all the business in a particular industry", u: 9},
    // 70
    {id: 70, w: "terms & conditions", d: "The document governing the contractual relationship between the provider and a user", u: 9},
    // 71
    {id: 71, w: "isp", d: "Internet Service Provider", u: 9},
    // 72
    {id: 72, w: "data cap", d: "A limit that a cell phone provider enforces to prevent any single user from overloading a network", u: 9},
    // 73
    {id: 73, w: "common carrier", d: "An entity that provides wired and wireless communication services to the general public for free", u: 9},
    // 74
    {id: 74, w: "end user", d: "The person or organization that uses a product or service", u: 9},
    // 75
    {id: 75, w: "end-to-end principle", d: "States that network features should be implemented as close to the end points of the network (apps) as possible", u: 9},
    // 76
    {id: 76, w: "provision", d: "The act of providing goods or services for use", u: 9},
    // 77
    {id: 77, w: "web hosting", d: "The business or activity of providing storage space and access for websites", u: 9},
    // 78
    {id: 78, w: "web-enabled", d: "Designed or able to be used on the internet", u: 9},
    // 79
    {id: 79, w: "information superhighway", d: "A global digital network capable of high-speed data transfer", u: 9},
    // 80
    {id: 80, w: "cybersquatting", d: "Purchasing a domain which is identical to other trademarks/brands and holding it for resale", u: 9},
    
    // UNIT 10: Surveillance & Rights
    // 81
    {id: 81, w: "to extend", d: "To cover or reach into", u: 10},
    // 82
    {id: 82, w: "surveillance", d: "The careful watching of a person or place, especially by authority", u: 10},
    // 83
    {id: 83, w: "repression", d: "The use of force or violence to control a group of people", u: 10},
    // 84
    {id: 84, w: "dissent", d: "A strong difference of opinion on a particular subject, especially about an official suggestion", u: 10},
    // 85
    {id: 85, w: "consumer privacy", d: "The handling and protection of sensitive personal information provided by customers", u: 10},
    // 86
    {id: 86, w: "data transfer", d: "The collection, replication, and transmission of large datasets from one organization to another", u: 10},
    // 87
    {id: 87, w: "to require", d: "To make it officially necessary for someone to do something", u: 10},
    // 88
    {id: 88, w: "to add insult to injury", d: "To make an unfavourable situation even worse", u: 10},
    // 89
    {id: 89, w: "piracy", d: "The act of illegally copying a computer program, music, film etc.", u: 10},
    // 90
    {id: 90, w: "intellectual property", d: "Someone's idea or invention that can be protected by law from being copied", u: 10},
    // 91
    {id: 91, w: "through lines", d: "A common or consistent element shared by parts of a whole", u: 10},
    // 92
    {id: 92, w: "to expropriate", d: "To take away money or property especially for public use without payment", u: 10},
    // 93
    {id: 93, w: "dissident", d: "A person who publicly disagrees with and criticizes their government", u: 10},
    // 94
    {id: 94, w: "tangible", d: "Real and not imaginary; able to be shown, touched, or experienced", u: 10},
    // 95
    {id: 95, w: "brazen", d: "Obvious, without any attempt to be hidden", u: 10},
    // 96
    {id: 96, w: "hoax", d: "To deceive someone, especially by playing a trick on them", u: 10},
    // 97
    {id: 97, w: "to compel", d: "To force someone to do something", u: 10},
    // 98
    {id: 98, w: "to allege", d: "To say that someone has done something illegal or wrong without giving any proof", u: 10},
    // 99
    {id: 99, w: "to log", d: "To write something down to make an official record of it", u: 10},
    // 100
    {id: 100, w: "incredulous", d: "Not wanting or not able to believe something", u: 10},
    // 101
    {id: 101, w: "to transmit", d: "To broadcast something", u: 10},
    // 102
    {id: 102, w: "mandate", d: "An official order or requirement to do something", u: 10},
    // 103
    {id: 103, w: "pacifist", d: "Someone who advocates peace and believes that war is wrong", u: 10},
    // 104
    {id: 104, w: "testimony", d: "A formal spoken or written statement, often before a court of law", u: 10},
    // 105
    {id: 105, w: "in violation of", d: "Breaking/contravening the rules", u: 10},
    // 106
    {id: 106, w: "to prosecute", d: "To conduct legal proceedings against", u: 10},
    // 107
    {id: 107, w: "to immerse", d: "To be completely involved in something", u: 10},
    
    // UNIT 10: Advanced Cyber
    // 108
    {id: 108, w: "data scraping", d: "The process of importing information from a website into a spreadsheet or local file", u: 10},
    // 109
    {id: 109, w: "api", d: "Application Programming Interface - a software intermediary that allows two applications to talk to each other", u: 10},
    // 110
    {id: 110, w: "social engineering", d: "The use of deception to manipulate individuals into divulging confidential information", u: 10},
    // 111
    {id: 111, w: "breached credential checking", d: "When credential stuffing occurs you can check whether you have been impacted", u: 10},
    // 112
    {id: 112, w: "doxing", d: "The action of finding or publishing private information about someone on the internet without permission", u: 10},
    // 113
    {id: 113, w: "affiliate", d: "An organization that is officially connected with or controlled by another organization", u: 10},
    // 114
    {id: 114, w: "crawler software", d: "An internet bot that systematically browses the world wide web, used by search engines", u: 10},
    // 115
    {id: 115, w: "hashing", d: "A method of taking data, encrypting it, and creating unpredictable irreversible output", u: 10},
    // 116
    {id: 116, w: "bug fairy", d: "Slang - someone who brings or reports a bug or error to a developer", u: 10},
    // 117
    {id: 117, w: "loophole", d: "An error or opening in the computer code allowing a program to be manipulated or exploited", u: 10},
    // 118
    {id: 118, w: "fuzz testing", d: "A technique used to test software for unknown vulnerabilities", u: 10},
    // 119
    {id: 119, w: "data mining", d: "Discovering hidden values from within a large amount of unknown data", u: 10},
    // 120
    {id: 120, w: "cyber law", d: "The legal system that deals with the internet, cyberspace and respective legal issues", u: 10},
    // 121
    {id: 121, w: "account harvesting", d: "To record login and password information from a legitimate user to illegally gain access", u: 10},
    // 122
    {id: 122, w: "authentication", d: "The process of identifying a person and making sure they are whom they say they are", u: 10},
    // 123
    {id: 123, w: "biometrics", d: "Identification of a person by the measurement of their biological features", u: 10},
    // 124
    {id: 124, w: "black hat", d: "A deceptive user, hacker, or individual who attempts to break into a system", u: 10},
    // 125
    {id: 125, w: "bootleg", d: "An illegal copy of software that was not purchased from the developer", u: 10},
    // 126
    {id: 126, w: "bug bounty", d: "A financial reward offered to anyone who discovers and reports bugs", u: 10},
    // 127
    {id: 127, w: "deep web", d: "The large section of content on the world wide web that isn't catalogued by standard search engines", u: 10},
    // 128
    {id: 128, w: "dark web", d: "Hidden part of the WWW, consisting of encrypted websites only accessible using non-standard browsers", u: 10},
    // 129
    {id: 129, w: "data breach", d: "Situation where an attacker gains access to a restricted area on a computer or network", u: 10},
    // 130
    {id: 130, w: "ethical hacking", d: "Hacking performed by a company or individual to help identify potential threats", u: 10},
    
    // UNIT 11: Supercomputers
    // 131
    {id: 131, w: "mathematical", d: "Relating to the study of numbers", u: 11},
    // 132
    {id: 132, w: "high-speed", d: "Moves or operates very quickly", u: 11},
    // 133
    {id: 133, w: "high-performance", d: "Able to operate to a high standard and at high speed", u: 11},
    // 134
    {id: 134, w: "scientific", d: "Relating to science, or using the organized methods of science", u: 11},
    // 135
    {id: 135, w: "engineering", d: "The work of an engineer, or the study of this work", u: 11},
    // 136
    {id: 136, w: "cryptology", d: "The study of codes (secret systems of words or numbers)", u: 11},
    // 137
    {id: 137, w: "computational", d: "Used to describe the process of computing", u: 11},
    // 138
    {id: 138, w: "to optimize", d: "To make something as good as possible", u: 11},
    // 139
    {id: 139, w: "cpu", d: "Central Processing Unit: the part of a computer that controls all the other parts", u: 11},
    // 140
    {id: 140, w: "equation", d: "Mathematical statement in which you show that two amounts are equal", u: 11},
    // 141
    {id: 141, w: "differential", d: "The amount of difference between things that are compared", u: 11},
    // 142
    {id: 142, w: "to obtain", d: "To get something, especially by working for it", u: 11},
    // 143
    {id: 143, w: "aggregation", d: "A collection of smaller pieces of linked data that form a larger whole", u: 11},
    // 144
    {id: 144, w: "susceptible", d: "Easily influenced or harmed by something", u: 11},
    // 145
    {id: 145, w: "to conduct", d: "To organize and perform a particular activity", u: 11},
    // 146
    {id: 146, w: "nisq", d: "Noisy Intermediate-Scale Quantum computing", u: 11},
    // 147
    {id: 147, w: "venture capital", d: "An industry that has money available for investment in a new company", u: 11},
    // 148
    {id: 148, w: "ambient", d: "Especially of environmental conditions, existing in the surrounding area", u: 11},
    // 149
    {id: 149, w: "cloud computing", d: "Working on a computer where the actual calculation or storage is done remotely", u: 11},
    // 150
    {id: 150, w: "parallel processing", d: "Processors running different parts of the same computer program concurrently", u: 11},
    // 151
    {id: 151, w: "cache", d: "An area of memory used to hold commonly used variables", u: 11},
    
    // UNIT 12: Crypto & Finance
    // 152
    {id: 152, w: "currency", d: "Anything that holds value and can be exchanged for goods or services", u: 12},
    // 153
    {id: 153, w: "to transfer", d: "To move money from one account to another", u: 12},
    // 154
    {id: 154, w: "to forge", d: "To make an illegal copy of something in order to deceive", u: 12},
    // 155
    {id: 155, w: "signature", d: "The data used for identification purposes most often found in email messages", u: 12},
    // 156
    {id: 156, w: "server", d: "A software or hardware device that accepts and responds to requests made over a network", u: 12},
    // 157
    {id: 157, w: "to rein in", d: "To control something and stop it increasing", u: 12},
    // 158
    {id: 158, w: "an asset", d: "Something that is owned by a person, company, or organization", u: 12},
    // 159
    {id: 159, w: "transparency", d: "Situation in which business activities are done openly without secrets", u: 12},
    // 160
    {id: 160, w: "return", d: "The amount of profit made by an investment or a business activity", u: 12},
    // 161
    {id: 161, w: "volatile", d: "Likely to change often or suddenly and unexpectedly", u: 12},
    // 162
    {id: 162, w: "demise", d: "The end of something that was previously considered to be powerful", u: 12},
    // 163
    {id: 163, w: "to endure", d: "To suffer something difficult, unpleasant, or painful", u: 12},
    // 164
    {id: 164, w: "incentive", d: "Something that encourages a person to do something", u: 12},
    // 165
    {id: 165, w: "feud", d: "An argument that has existed for a long time between two people or groups", u: 12},
    // 166
    {id: 166, w: "prone to", d: "Likely to show a particular characteristic, usually a negative one", u: 12},
    // 167
    {id: 167, w: "price swings", d: "Fluctuation in prices", u: 12},
    // 168
    {id: 168, w: "pound sterling", d: "British currency", u: 12},
    // 169
    {id: 169, w: "tipping point", d: "The time at which a change or an effect cannot be stopped", u: 12},
    // 170
    {id: 170, w: "crypto wallet", d: "Software program where crypto are stored", u: 12},
    // 171
    {id: 171, w: "transaction flows", d: "The observable path and movement of funds between accounts or wallets", u: 12},
    // 172
    {id: 172, w: "lever", d: "Something you use to try to persuade someone to do what you want", u: 12},
    // 173
    {id: 173, w: "to prosper", d: "To become successful", u: 12},
    // 174
    {id: 174, w: "inception", d: "The beginning of something", u: 12},
    // 175
    {id: 175, w: "incubator", d: "An organisation that helps people to start new companies", u: 12},
    // 176
    {id: 176, w: "illicit", d: "Illegal", u: 12},
    // 177
    {id: 177, w: "scammer", d: "Someone who makes money using illegal methods", u: 12},
    // 178
    {id: 178, w: "flimsy", d: "Weak", u: 12},
    // 179
    {id: 179, w: "fungible", d: "Goods that are easy to trade for others of the same type and value", u: 12},
    // 180
    {id: 180, w: "token", d: "In the digital world, it is something that is used instead of money", u: 12},
    // 181
    {id: 181, w: "ledger", d: "A computer document in which a company's accounts are recorded", u: 12},
    // 182
    {id: 182, w: "commodities", d: "A product that can be traded, bought or sold", u: 12},
    // 183
    {id: 183, w: "exchange", d: "A place or organization where shares, currencies, commodities, etc. are traded", u: 12},
    // 184
    {id: 184, w: "bubble", d: "A temporary period in which a lot of people invest, causing the product to become expensive", u: 12},
    // 185
    {id: 185, w: "royalties", d: "Payment made to writers, inventors, owners of property etc.", u: 12},
    // 186
    {id: 186, w: "distribution", d: "To give or sell (copies of) something to a number of recipients", u: 12},
    // 187
    {id: 187, w: "sole ownership", d: "Where there is only one owner of something", u: 12},
    // 188
    {id: 188, w: "valuation", d: "The determination of how much money something is worth", u: 12},
    // 189
    {id: 189, w: "to surge", d: "To increase suddenly and strongly", u: 12},
    // 190
    {id: 190, w: "fad", d: "An activity that is interesting for a short period of time", u: 12},
    // 191
    {id: 191, w: "securities", d: "Could be a bond or a share that you trade on a financial market", u: 12},
    // 192
    {id: 192, w: "recession", d: "A period during which the economy is unsuccessful and conditions for businesses are bad", u: 12},
    // 193
    {id: 193, w: "counterfeit returns", d: "Fake profits from investments", u: 12},
    // 194
    {id: 194, w: "to tout", d: "To talk about it in such a way that you want people to like, accept or buy it", u: 12},
    // 195
    {id: 195, w: "decentralized", d: "No centralized authority is required to regulate, control, or issue the currency", u: 12},
    
    // ACADEMIC VERBS (Unit 12)
    // 196
    {id: 196, w: "to analyze", d: "To examine something closely and in detail", u: 12},
    // 197
    {id: 197, w: "to assess", d: "To evaluate or determine the value, significance, or quality of something", u: 12},
    // 198
    {id: 198, w: "to compare", d: "To identify similarities and differences between two or more items or concepts", u: 12},
    // 199
    {id: 199, w: "to contrast", d: "To highlight the differences between two or more items or ideas", u: 12},
    // 200
    {id: 200, w: "to define", d: "To provide a clear and precise meaning of a term or concept", u: 12},
    // 201
    {id: 201, w: "to demonstrate", d: "To show or prove something with evidence or examples", u: 12},
    // 202
    {id: 202, w: "to evaluate", d: "To critically assess, judge, or determine the worth or quality of something", u: 12},
    // 203
    {id: 203, w: "to examine", d: "To inspect or investigate something thoroughly", u: 12},
    // 204
    {id: 204, w: "to explain", d: "To make something clear or easy to understand by describing or detailing", u: 12},
    // 205
    {id: 205, w: "to identify", d: "To recognize and name something, often as part of classification", u: 12},
    // 206
    {id: 206, w: "to illustrate", d: "To provide examples, diagrams, or visual aids to support or explain a point", u: 12},
    // 207
    {id: 207, w: "to interpret", d: "To explain or provide meaning to something, often based on analysis", u: 12},
    // 208
    {id: 208, w: "to investigate", d: "To conduct research or inquiry into a particular subject or problem", u: 12},
    // 209
    {id: 209, w: "to outline", d: "To give a brief overview or summary of the main points or structure", u: 12},
    // 210
    {id: 210, w: "to propose", d: "To suggest or put forward an idea, plan, or hypothesis", u: 12},
    // 211
    {id: 211, w: "to report", d: "To present factual information, often based on research or observations", u: 12},
    // 212
    {id: 212, w: "to review", d: "To assess or evaluate something critically, such as literature or research", u: 12},
    // 213
    {id: 213, w: "to summarize", d: "To provide a condensed version of the main points or ideas", u: 12},
    // 214
    {id: 214, w: "to synthesize", d: "To combine and integrate information or ideas to create a coherent whole", u: 12},
    // 215
    {id: 215, w: "to support", d: "To provide evidence or arguments to back up a claim or statement", u: 12},
    // 216
    {id: 216, w: "to test", d: "To investigate or experiment with the purpose of proving or disproving a hypothesis", u: 12},
    // 217
    {id: 217, w: "to validate", d: "To confirm or prove the accuracy, reliability, or legitimacy of something", u: 12},
    // 218
    {id: 218, w: "to exemplify", d: "To provide examples that typify or represent a concept or idea", u: 12},
    // 219
    {id: 219, w: "to justify", d: "To provide reasons or evidence to defend or explain a decision or argument", u: 12},
    // 220
    {id: 220, w: "to criticize", d: "To analyze and evaluate something, often by pointing out its flaws or weaknesses", u: 12}
];