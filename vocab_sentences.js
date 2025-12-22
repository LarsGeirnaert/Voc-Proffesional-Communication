const vocabSentences = {
    // UNIT 7
    1: [
        "The reliability of the server ensures 99.9% uptime.",
        "We chose this vendor because of the high reliability of their software.",
        "Reliability is a key factor when selecting a cloud provider."
    ],
    2: [
        "A security officer must be a person of high integrity.",
        "Data integrity ensures that information has not been altered during transfer.",
        "He questioned the integrity of the voting system after the glitch."
    ],
    3: [
        "She performed the code review with great diligence.",
        "Due diligence is required before buying a new tech company.",
        "With enough diligence, you can find the bug in this complex code."
    ],
    4: [
        "The algorithm was audited to ensure fairness in hiring processes.",
        "Fairness dictates that all users should have equal access to the network.",
        "Critics argued that the pricing model lacked fairness for small businesses."
    ],
    5: [
        "He could not hack the hospital because his conscience wouldn't let him.",
        "A hacker with a conscience might report the bug instead of exploiting it.",
        "His conscience bothered him after he read the stolen emails."
    ],
    6: [
        "We conducted a preliminary scan before the full penetration test.",
        "The preliminary results show no signs of a data breach.",
        "This is just a preliminary version of the software, not the final release."
    ],
    7: [
        "Complacency in cybersecurity leads to missed vulnerabilities.",
        "After years of no attacks, complacency became the company's biggest enemy.",
        "We must avoid complacency and keep our antivirus updated."
    ],
    8: [
        "The breach and subsequent data leak caused a stock drop.",
        "Any subsequent attempts to login were blocked by the firewall.",
        "The error and subsequent crash destroyed unsaved work."
    ],
    9: [
        "All employees must adhere to the new password policy.",
        "If you do not adhere to the rules, your account will be suspended.",
        "Strictly adhere to the safety protocols when entering the server room."
    ],
    10: [
        "The software was updated to comply with GDPR regulations.",
        "Failure to comply with safety standards can result in a fine.",
        "All devices must comply with the new wireless transmission standards."
    ],
    11: [
        "Moral disengagement allows hackers to justify their crimes.",
        "The disengagement of the security team led to a slow response time.",
        "His disengagement from the project caused delays."
    ],
    12: [
        "We use encryption to minimize the risk of data theft.",
        "Try to minimize the number of open ports on the server.",
        "To minimize downtime, we use redundant servers."
    ],
    13: [
        "The car crashed into the median on the highway.",
        "Cables were buried under the median to connect the two data centers.",
        "Stay off the median while driving."
    ],
    14: [
        "You should rotate your passwords every three months.",
        "We rotate the backup tapes to ensure data redundancy.",
        "Security guards rotate shifts to monitor the screens 24/7."
    ],
    15: [
        "The unsubscribe button was hidden by a deceptive dark pattern.",
        "Using a dark pattern to trick customers is unethical design.",
        "He fell for a dark pattern and accidentally bought the premium version."
    ],
    16: [
        "Nobody reads the terms of service before clicking 'I Agree'.",
        "Violating the terms of service can get your account banned.",
        "The terms of service explicitly forbid reverse engineering the app."
    ],
    17: [
        "Downloading movies illegally is a violation of copyright.",
        "The software code is protected by strict copyright laws.",
        "You cannot use that music in your video due to copyright."
    ],
    18: [
        "Posting everything on social media leaves a huge digital footprint.",
        "VPNs help reduce your digital footprint while browsing.",
        "Employers often check your digital footprint before hiring."
    ],
    19: [
        "The antivirus detected malicious software in the attachment.",
        "Installing malicious software can corrupt your entire hard drive.",
        "Never download files from untrusted sites to avoid malicious software."
    ],
    20: [
        "The spyware recorded every keystroke on his laptop.",
        "He didn't know spyware was running in the background.",
        "Anti-malware tools are designed to detect and remove spyware."
    ],
    21: [
        "The game download was actually a trojan horse containing a virus.",
        "Don't open that email attachment, it might be a trojan horse.",
        "A trojan horse allows hackers backdoor access to your system."
    ],
    22: [
        "The hospital's database was encrypted by ransomware.",
        "They refused to pay the bitcoin demanded by the ransomware.",
        "Backups are your best defense against a ransomware attack."
    ],
    23: [
        "His browser was slow because it was full of adware.",
        "Free software often comes bundled with annoying adware.",
        "Adware popped up on his screen every five minutes."
    ],

    // UNIT 8
    24: [
        "The innovation prize helped to spur development in AI.",
        "Competition helps to spur companies to improve security.",
        "Lower taxes can spur economic growth in the tech sector."
    ],
    25: [
        "The government plans to outlaw deepfake pornography.",
        "Many countries outlaw the use of unlicensed encryption software.",
        "They voted to outlaw the sale of user data to third parties."
    ],
    26: [
        "China uses deep packet inspection to filter internet traffic.",
        "Deep packet inspection allows the ISP to see exactly what you are downloading.",
        "Privacy advocates argue against the use of deep packet inspection."
    ],
    27: [
        "The influencer gave an endorsement to the VPN service.",
        "Without an official endorsement, the software seemed untrustworthy.",
        "His endorsement of the crypto coin caused its price to spike."
    ],
    28: [
        "Major telcos are rolling out 5G networks.",
        "The telcos were accused of throttling internet speeds.",
        "In many countries, telcos are government-owned monopolies."
    ],
    29: [
        "The press decided to dub the hacker 'The Ghost'.",
        "Critics dub this new virus the most dangerous ever.",
        "They decided to dub the project 'Operation Firewall'."
    ],
    30: [
        "Each computer in the network acts as a node.",
        "If one node fails, the rest of the blockchain keeps working.",
        "Data travels from node to node until it reaches the destination."
    ],
    31: [
        "End-to-end encryption protects your WhatsApp messages.",
        "Without encryption, anyone on the Wi-Fi can read your data.",
        "Strong encryption makes it nearly impossible to crack the file."
    ],
    32: [
        "It took hours to decode the encrypted file.",
        "Spies use special keys to decode secret messages.",
        "The receiver needs the private key to decode the transmission."
    ],
    33: [
        "We need to encode the data before transmission.",
        "Video files are hard to encode without a powerful CPU.",
        "Developers encode characters into binary format."
    ],
    34: [
        "Hackers tried to intercept the banking transaction.",
        "The firewall is designed to intercept malicious packets.",
        "Police managed to intercept the encrypted messages."
    ],
    35: [
        "Access denied: unauthorized personnel only.",
        "An unauthorized user attempted to access the admin panel.",
        "Unauthorized copying of this software is illegal."
    ],
    36: [
        "I used a VPN to bypass the geo-blocking on Netflix.",
        "Geo-blocking prevents users in Europe from seeing the US content.",
        "The website uses geo-blocking to comply with local laws."
    ],
    37: [
        "A vpn hides your IP address from websites.",
        "Employees use a vpn to connect securely to the office network.",
        "Using a public Wi-Fi without a vpn is risky."
    ],
    38: [
        "The IT team is ready to deploy the new patch.",
        "It takes time to deploy software across thousands of computers.",
        "They plan to deploy the firewall rules tonight."
    ],
    39: [
        "Company policy is to prohibit the use of personal USB drives.",
        "Schools often prohibit access to social media sites.",
        "The new law will prohibit the collection of biometric data without consent."
    ],
    40: [
        "The suppression of free speech is common in dictatorships.",
        "Digital suppression involves blocking opposition websites.",
        "The suppression of evidence is a serious crime."
    ],
    41: [
        "He signed a non-disclosure agreement before seeing the prototype.",
        "Breaching the non-disclosure agreement led to a lawsuit.",
        "The non-disclosure agreement prevents him from talking to the press."
    ],
    42: [
        "They decided to outsource their customer support to India.",
        "It is cheaper to outsource the coding than to hire local developers.",
        "Many companies outsource their IT security management."
    ],
    43: [
        "The CEO issued a statement to refute the allegations of fraud.",
        "Logs were used to refute the claim that the system was hacked.",
        "I have evidence to refute your theory."
    ],
    44: [
        "This court case sets a legal precedent for digital privacy.",
        "There is no precedent for handling a cyberattack of this scale.",
        "Following precedent, the judge ruled in favor of the user."
    ],
    45: [
        "The default password should always be changed immediately.",
        "If you don't choose a setting, the default will be applied.",
        "The router comes with 'admin' as the default username."
    ],
    46: [
        "Modern cryptography is essential for secure online banking.",
        "He studied cryptography to understand how to break codes.",
        "Quantum computing poses a threat to current cryptography."
    ],
    47: [
        "The firewall uses a blacklist to block known malicious IPs.",
        "His email server was put on a blacklist for sending spam.",
        "Once you are on a blacklist, it is hard to get removed."
    ],
    48: [
        "He was a victim of cancel culture after his old tweets resurfaced.",
        "Cancel culture can destroy a career in a matter of days.",
        "The debate about cancel culture dominates social media."
    ],
    49: [
        "Twitter decided to deplatform the user for hate speech.",
        "To deplatform someone means taking away their digital megaphone.",
        "Critics argue that efforts to deplatform extremists simply drive them underground."
    ],
    50: [
        "Russian bots spread disinformation during the election.",
        "It is hard to distinguish truth from disinformation online.",
        "The goal of disinformation is to create confusion."
    ],
    51: [
        "The company is liable for any data breaches that occur.",
        "You are liable for damages if you misuse the software.",
        "Is the platform liable for content posted by users?"
    ],
    52: [
        "His engagement dropped, so he suspected a shadow ban.",
        "A shadow ban is frustrating because you don't know you are blocked.",
        "Instagram denied placing a shadow ban on his account."
    ],
    53: [
        "There is too much subjectivity in how these rules are enforced.",
        "Algorithms try to remove subjectivity from decision making.",
        "The subjectivity of the moderator led to unfair bans."
    ],

    // UNIT 9
    54: [
        "Google has a near monopoly on internet search.",
        "The government broke up the telecom monopoly.",
        "Having a monopoly allows a company to set high prices."
    ],
    55: [
        "Switching your internet provider can save you money.",
        "The cloud provider suffered a major outage yesterday.",
        "Choose a provider that values your privacy."
    ],
    56: [
        "The scale of this cyberattack is unprecedented.",
        "We are seeing an unprecedented demand for GPUs.",
        "The growth of the internet in the 90s was unprecedented."
    ],
    57: [
        "Big tech companies try to freeze somebody out to kill competition.",
        "They tried to freeze somebody out of the market by lowering prices.",
        "Don't let them freeze somebody out just because they are small."
    ],
    58: [
        "The app supports a third-party purchase via PayPal.",
        "Any third-party purchase is not covered by our warranty.",
        "Be careful with a third-party purchase on unknown sites."
    ],
    59: [
        "The hacker allegedly stole a million passwords.",
        "He allegedly used a botnet to launch the attack.",
        "The CEO allegedly knew about the bug but ignored it."
    ],
    60: [
        "Data analysis is a core process of their business model.",
        "Security should be a core process, not an afterthought.",
        "Manufacturing is the core process of this factory."
    ],
    61: [
        "The main drawback of this software is its high price.",
        "A drawback of wireless charging is the slow speed.",
        "One drawback of cloud storage is the need for internet."
    ],
    62: [
        "Netflix uses machine learning to recommend movies.",
        "Machine learning models need vast amounts of data to train.",
        "We use machine learning to detect fraudulent transactions."
    ],
    63: [
        "Satellites are used to relay signals across the globe.",
        "The server helps to relay emails to the correct destination.",
        "Please relay this message to the admin."
    ],
    64: [
        "Payday loans are often accused of usury.",
        "Charging 50% interest is considered usury.",
        "Laws against usury protect borrowers from predatory lenders."
    ],
    65: [
        "The app store takes a 30% commission on all sales.",
        "He earns a commission for every new user he refers.",
        "The bank charges a small commission for currency exchange."
    ],
    66: [
        "HTTP is the standard protocol for the world wide web.",
        "Security protocol dictates that you lock your screen when leaving.",
        "They followed the protocol to safely shut down the reactor."
    ],
    67: [
        "I bought a new domain name for my portfolio website.",
        "The website domain was seized by the FBI.",
        "You need to renew your domain registration annually."
    ],
    68: [
        "I cancelled my monthly subscription to the streaming service.",
        "The software requires a yearly subscription to work.",
        "A subscription model ensures steady revenue for the developer."
    ],
    69: [
        "Apple and Google form a duopoly in the mobile OS market.",
        "Consumers suffer when a duopoly controls prices.",
        "A duopoly is almost as bad as a monopoly for competition."
    ],
    70: [
        "You must accept the terms & conditions to use the app.",
        "The terms & conditions were updated to include AI usage.",
        "Hidden in the terms & conditions was a clause about data selling."
    ],
    71: [
        "My isp is throttling my connection speed.",
        "You should call your isp if the internet is down.",
        "Choose an isp that respects net neutrality."
    ],
    72: [
        "I hit my monthly data cap and now my internet is slow.",
        "Unlimited plans usually have no data cap.",
        "Streaming 4K video will consume your data cap quickly."
    ],
    73: [
        "The telephone company is regulated as a common carrier.",
        "As a common carrier, they cannot discriminate against traffic.",
        "Is an ISP a common carrier or an information service?"
    ],
    74: [
        "The interface must be simple for the end user.",
        "Software should be designed with the end user in mind.",
        "The end user shouldn't need to know how the code works."
    ],
    75: [
        "The internet was built on the end-to-end principle.",
        "Violating the end-to-end principle breaks internet neutrality.",
        "The end-to-end principle keeps the core network simple."
    ],
    76: [
        "The provision of free Wi-Fi is standard in hotels.",
        "Cloud provision allows for scalable server resources.",
        "The contract includes a provision for early termination."
    ],
    77: [
        "We pay a monthly fee for web hosting.",
        "Good web hosting ensures your site loads quickly.",
        "They moved their web hosting to AWS."
    ],
    78: [
        "This printer is web-enabled so you can print remotely.",
        "Smart devices are web-enabled to connect to the IoT.",
        "The web-enabled camera allows me to check my house."
    ],
    79: [
        "In the 90s, they called the internet the information superhighway.",
        "The information superhighway connects billions of people.",
        "Traffic on the information superhighway is growing exponentially."
    ],
    80: [
        "The company sued him for cybersquatting on their brand name.",
        "Cybersquatting involves buying domains hoping to sell them for profit.",
        "He made a fortune through legal domain trading, not cybersquatting."
    ],

    // UNIT 10
    81: [
        "We plan to extend the Wi-Fi coverage to the garden.",
        "You can extend the functionality of the browser with plugins.",
        "They agreed to extend the deadline by one week."
    ],
    82: [
        "Mass surveillance is a threat to individual privacy.",
        "Cameras provide 24/7 surveillance of the building.",
        "The suspect was under police surveillance."
    ],
    83: [
        "Internet censorship is a tool of political repression.",
        "The citizens fought against the brutal repression.",
        "Freedom of speech is the antidote to repression."
    ],
    84: [
        "The government tried to crush online dissent.",
        "Blogs became a platform for political dissent.",
        "In a democracy, peaceful dissent is welcomed."
    ],
    85: [
        "GDPR laws were created to protect consumer privacy.",
        "Violating consumer privacy can lead to massive fines.",
        "Tracking cookies are often an invasion of consumer privacy."
    ],
    86: [
        "The data transfer between servers took all night.",
        "Secure data transfer uses SSL/TLS protocols.",
        "Limit your data transfer to avoid extra charges."
    ],
    87: [
        "We require two-factor authentication for all logins.",
        "New laws require companies to report breaches within 72 hours.",
        "This job will require advanced Python skills."
    ],
    88: [
        "He was hacked, and to add insult to injury, the bank fined him.",
        "To add insult to injury, the backup files were also corrupted.",
        "It rained on my wedding day, and to add insult to injury, the band cancelled."
    ],
    89: [
        "Software piracy costs the industry billions each year.",
        "Downloading cracked games is a form of piracy.",
        "Online piracy is hard to stop completely."
    ],
    90: [
        "The code is the company's intellectual property.",
        "Patents protect technical intellectual property.",
        "Stealing intellectual property is a serious crime."
    ],
    91: [
        "Privacy is one of the through lines in this debate.",
        "A lack of security is one of the through lines in these incidents.",
        "The hero's journey is a common through line in movies."
    ],
    92: [
        "The state threatened to expropriate the data center land.",
        "Dictators often expropriate private companies.",
        "They cannot expropriate your assets without due process."
    ],
    93: [
        "The dissident used Tor to communicate safely.",
        "A political dissident was arrested for his blog posts.",
        "She is a well-known dissident fighting for human rights."
    ],
    94: [
        "There is no tangible evidence of a data breach.",
        "Crypto assets are digital, not tangible.",
        "We need tangible results, not just theories."
    ],
    95: [
        "It was a brazen attack in broad daylight.",
        "The hackers were brazen enough to demand a ransom publicly.",
        "He told a brazen lie to the manager."
    ],
    96: [
        "The viral video turned out to be a hoax.",
        "Don't spread that rumor, it is a known hoax.",
        "The bomb threat was fortunately a hoax."
    ],
    97: [
        "The court can compel the company to release the data.",
        "We cannot compel users to update their software.",
        "Logic should compel you to agree."
    ],
    98: [
        "They allege that the software contains spyware.",
        "Prosecutors allege that he stole the credit card numbers.",
        "I do not allege that you are lying, but I need proof."
    ],
    99: [
        "The system will log every login attempt.",
        "You must log into the console to see the errors.",
        "Ships log their position every hour."
    ],
    100: [
        "He was incredulous when he saw his empty bank account.",
        "The tech support was incredulous that I hadn't rebooted yet.",
        "She gave me an incredulous look when I told the story."
    ],
    101: [
        "Fiber optics transmit data at the speed of light.",
        "Radio towers transmit signals over long distances.",
        "Do not transmit sensitive data over HTTP."
    ],
    102: [
        "There is a new mandate for stronger passwords.",
        "The government issued a mandate to ban crypto.",
        "The CEO has a clear mandate to cut costs."
    ],
    103: [
        "As a pacifist, he refused to work on military drones.",
        "A pacifist believes that cyberwarfare is still warfare.",
        "She remained a pacifist despite the conflict."
    ],
    104: [
        "Her testimony was crucial in the cybercrime trial.",
        "The expert gave testimony about the malware code.",
        "False testimony can land you in jail."
    ],
    105: [
        "Your post was deleted for being in violation of our policy.",
        "Tracking users without consent is in violation of GDPR.",
        "They were fined for acting in violation of safety rules."
    ],
    106: [
        "They decided to prosecute the hacker for identity theft.",
        "It is difficult to prosecute cybercriminals across borders.",
        "The district attorney declined to prosecute the case."
    ],
    107: [
        "VR allows you to immerse yourself in a digital world.",
        "Gamers like to immerse themselves in complex stories.",
        "To learn a language, you must immerse yourself in it."
    ],

    // UNIT 10 ADVANCED
    108: [
        "They used data scraping to collect prices from competitors.",
        "LinkedIn bans bots that perform data scraping.",
        "Data scraping allows us to build a large database quickly."
    ],
    109: [
        "Our app uses the Google Maps api to show locations.",
        "An open api allows developers to build extensions.",
        "The api key must be kept secret."
    ],
    110: [
        "Phishing is a common form of social engineering.",
        "Hackers use social engineering to trick employees.",
        "Social engineering targets human weakness rather than software bugs."
    ],
    111: [
        "Use breached credential checking services to see if your password is safe.",
        "Regular breached credential checking prevents account takeovers.",
        "Browsers now have built-in breached credential checking."
    ],
    112: [
        "He was a victim of doxing after an online argument.",
        "Doxing involves revealing someone's real address online.",
        "The platform has strict rules against doxing users."
    ],
    113: [
        "We are an affiliate of a larger software corporation.",
        "The hacker group is an affiliate of a state-sponsored actor.",
        "You can earn money as an affiliate marketer."
    ],
    114: [
        "Google uses crawler software to index the web.",
        "Malicious crawler software looks for email addresses to spam.",
        "We blocked the crawler software to save bandwidth."
    ],
    115: [
        "Passwords should be stored using hashing, not as plain text.",
        "Hashing ensures that the original data cannot be retrieved.",
        "MD5 is an old form of hashing that is no longer secure."
    ],
    116: [
        "A helpful bug fairy reported the glitch in our login page.",
        "The bug fairy anonymously sent us a patch for the exploit.",
        "Sometimes a bug fairy leaves a note in the code."
    ],
    117: [
        "The hacker exploited a loophole in the payment system.",
        "Closing the legal loophole stopped the tax evasion.",
        "He found a loophole that let him access the game for free."
    ],
    118: [
        "We found the crash by running fuzz testing overnight.",
        "Fuzz testing involves throwing random data at the program.",
        "Automated fuzz testing is part of our QA process."
    ],
    119: [
        "Retailers use data mining to predict shopping habits.",
        "Data mining reveals patterns in large datasets.",
        "Privacy groups are concerned about unchecked data mining."
    ],
    120: [
        "She specializes in international cyber law.",
        "Cyber law is struggling to keep up with AI developments.",
        "Breaking cyber law can result in extradition."
    ],
    121: [
        "Bots are used for account harvesting on social media.",
        "Account harvesting provides lists of valid emails for spammers.",
        "We implemented captchas to stop account harvesting."
    ],
    122: [
        "Multi-factor authentication adds a layer of security.",
        "Biometric authentication is becoming more common.",
        "Authentication failed because the password was wrong."
    ],
    123: [
        "FaceID is a form of biometrics used on iPhones.",
        "Using biometrics is safer than a simple password.",
        "Fingerprint scanners are a popular type of biometrics."
    ],
    124: [
        "A black hat hacker stole the credit card numbers.",
        "Companies hire white hats to stop black hat attacks.",
        "He switched from being a black hat to a security consultant."
    ],
    125: [
        "He bought a bootleg copy of Windows at the market.",
        "Bootleg software often contains malware.",
        "Selling bootleg DVDs is illegal."
    ],
    126: [
        "She earned $5000 in a bug bounty program.",
        "Google offers a bug bounty for finding vulnerabilities.",
        "Bug bounty hunters search for exploits in popular apps."
    ],
    127: [
        "Medical records are stored on the deep web.",
        "The deep web is much larger than the visible web.",
        "Your bank account details are on the deep web, not Google."
    ],
    128: [
        "Illegal drugs are often sold on the dark web.",
        "You need the Tor browser to access the dark web.",
        "The dark web is known for its anonymity."
    ],
    129: [
        "The company announced a massive data breach affecting millions.",
        "A data breach can destroy a company's reputation.",
        "Change your password immediately after a data breach."
    ],
    130: [
        "He took a course in ethical hacking to become a pentester.",
        "Ethical hacking involves breaking in with permission.",
        "Certified ethical hacking is a lucrative career."
    ],

    // UNIT 11
    131: [
        "Encryption relies on complex mathematical formulas.",
        "The AI solves mathematical problems faster than humans.",
        "He is a genius in mathematical modeling."
    ],
    132: [
        "We need a high-speed connection for video streaming.",
        "High-speed trains rely on advanced computer systems.",
        "Fiber provides high-speed internet to the office."
    ],
    133: [
        "Supercomputers use high-performance chips.",
        "Gamers demand high-performance graphics cards.",
        "This is a high-performance cluster for data analysis."
    ],
    134: [
        "This computer is used for scientific research.",
        "Scientific data processing requires huge storage.",
        "We followed the scientific method to test the hypothesis."
    ],
    135: [
        "Software engineering requires logical thinking.",
        "Social engineering targets people, not machines.",
        "Civil engineering involves building bridges and roads."
    ],
    136: [
        "Alan Turing was a pioneer in cryptology.",
        "Cryptology includes both making and breaking codes.",
        "The military uses advanced cryptology for communications."
    ],
    137: [
        "The simulation requires immense computational power.",
        "Computational complexity increases with data size.",
        "Computational biology uses computers to study genes."
    ],
    138: [
        "We need to optimize the code to run faster.",
        "AI can help optimize energy consumption.",
        "You should optimize images before uploading them."
    ],
    139: [
        "The cpu is the brain of the computer.",
        "A faster cpu improves gaming performance.",
        "The cpu overheated because the fan failed."
    ],
    140: [
        "The computer solved the complex equation in seconds.",
        "Balancing the load requires a simple equation.",
        "E=mc² is a famous physics equation."
    ],
    141: [
        "Calculus involves solving differential equations.",
        "A differential backup saves only changed files.",
        "The differential in speed was noticeable."
    ],
    142: [
        "Hackers try to obtain admin privileges.",
        "You must obtain a license to use this software.",
        "Where did you obtain this information?"
    ],
    143: [
        "Data aggregation helps in spotting trends.",
        "News sites use aggregation to show stories from many sources.",
        "The aggregation of user data is a privacy concern."
    ],
    144: [
        "Old systems are susceptible to new viruses.",
        "IoT devices are often susceptible to hacking.",
        "The server is susceptible to DDoS attacks."
    ],
    145: [
        "They plan to conduct a security audit.",
        "We conduct experiments to test the AI.",
        "Copper is used to conduct electricity."
    ],
    146: [
        "We are currently in the nisq era of quantum computing.",
        "Nisq computers are noisy but still useful.",
        "Researchers are trying to mitigate errors in nisq devices."
    ],
    147: [
        "The startup raised millions in venture capital.",
        "Venture capital fuels the tech industry.",
        "He works for a venture capital firm in Silicon Valley."
    ],
    148: [
        "Quantum computers are sensitive to ambient heat.",
        "Smart lights adjust to ambient light levels.",
        "The ambient noise in the room was distracting."
    ],
    149: [
        "AWS is a leader in cloud computing.",
        "Cloud computing allows you to work from anywhere.",
        "We moved our database to cloud computing."
    ],
    150: [
        "Supercomputers use parallel processing to be fast.",
        "Parallel processing splits tasks across many cores.",
        "GPUs are designed for parallel processing."
    ],
    151: [
        "Clearing the browser cache can fix loading errors.",
        "The CPU cache stores frequently accessed data.",
        "We use a cache to speed up the website."
    ],

    // UNIT 12
    152: [
        "Bitcoin is a digital currency.",
        "The value of the currency fluctuated wildly.",
        "The Euro is the official currency of many EU countries."
    ],
    153: [
        "I need to transfer funds to my savings account.",
        "Securely transfer files using SFTP.",
        "Transfer the data to the new hard drive."
    ],
    154: [
        "It is very difficult to forge a blockchain signature.",
        "Criminals try to forge digital certificates.",
        "He tried to forge his boss's signature on the check."
    ],
    155: [
        "The digital signature verifies the sender.",
        "Every transaction requires a cryptographic signature.",
        "Please put your signature at the bottom of the contract."
    ],
    156: [
        "The server crashed due to high traffic.",
        "We need to reboot the database server.",
        "The web server hosts our website."
    ],
    157: [
        "Governments want to rein in the power of Big Tech.",
        "New laws aim to rein in crypto spending.",
        "We must rein in costs before we run out of money."
    ],
    158: [
        "Data is a valuable asset for any company.",
        "Bitcoin is considered a digital asset.",
        "Her coding skills are a great asset to the team."
    ],
    159: [
        "Blockchain offers total transparency of transactions.",
        "We value transparency in our privacy policy.",
        "The government promised more transparency."
    ],
    160: [
        "High risk investments offer a high potential return.",
        "What is the return on investment for this software?",
        "He expects a 10% return on his crypto portfolio."
    ],
    161: [
        "Crypto markets are highly volatile.",
        "Stock prices became volatile after the news.",
        "Volatile memory loses data when power is off."
    ],
    162: [
        "Many predicted the demise of physical cash.",
        "The hack led to the demise of the exchange.",
        "Bad management caused the demise of the company."
    ],
    163: [
        "The system must endure heavy cyberattacks.",
        "Investors must endure periods of loss.",
        "This server is built to endure extreme temperatures."
    ],
    164: [
        "Miners have a financial incentive to validate blocks.",
        "There is no incentive to use a slow browser.",
        "The bonus was an incentive to finish the project early."
    ],
    165: [
        "The feud between the two developers split the community.",
        "A patent feud delayed the product launch.",
        "The family feud lasted for generations."
    ],
    166: [
        "Old software is prone to crashing.",
        "Humans are prone to falling for phishing scams.",
        "This area is prone to flooding."
    ],
    167: [
        "Bitcoin is known for its massive price swings.",
        "Day traders profit from short-term price swings.",
        "Political instability causes market price swings."
    ],
    168: [
        "The value of the pound sterling dropped.",
        "They accept payment in dollars or pound sterling.",
        "Pound sterling is one of the oldest currencies."
    ],
    169: [
        "AI adoption has reached a tipping point.",
        "The scandal was the tipping point for the CEO.",
        "We are at a tipping point in climate change."
    ],
    170: [
        "Never share the private key of your crypto wallet.",
        "I lost access to my crypto wallet password.",
        "Use a hardware crypto wallet for extra security."
    ],
    171: [
        "We analyze transaction flows to spot money laundering.",
        "Visualizing transaction flows helps detect fraud.",
        "Blockchain makes transaction flows public."
    ],
    172: [
        "Interest rates are a lever to control inflation.",
        "Technology is a lever for economic growth.",
        "Pull the lever to reset the machine."
    ],
    173: [
        "The tech industry continues to prosper.",
        "Cybercriminals prosper when security is weak.",
        "The business began to prosper after the update."
    ],
    174: [
        "Since its inception, the internet has changed the world.",
        "He has been with the project since its inception.",
        "The idea was flawed from its inception."
    ],
    175: [
        "The startup was launched in a tech incubator.",
        "An incubator provides office space and mentoring.",
        "Silicon Valley is a famous incubator for innovation."
    ],
    176: [
        "Crypto is sometimes used for illicit trade.",
        "The dark web is a hub for illicit activities.",
        "Police seized the illicit goods."
    ],
    177: [
        "The scammer tried to trick me into sending money.",
        "Report the phone number of the scammer immediately.",
        "Don't reply to the email, it's from a scammer."
    ],
    178: [
        "His excuse for the error was flimsy.",
        "The firewall provided only flimsy protection.",
        "That is a very flimsy argument."
    ],
    179: [
        "Dollar bills are fungible, but art is not.",
        "NFTs are non-fungible tokens, unlike Bitcoin which is fungible.",
        "Gold is a fungible asset."
    ],
    180: [
        "You need a token to access the API.",
        "This crypto token represents a share in the project.",
        "He gave me a token of his appreciation."
    ],
    181: [
        "The blockchain serves as a public ledger.",
        "Every transaction is recorded on the distributed ledger.",
        "A ledger tracks money coming in and out."
    ],
    182: [
        "Gold and oil are valuable commodities.",
        "Data is becoming one of the world's most valuable commodities.",
        "Prices of agricultural commodities rose sharply."
    ],
    183: [
        "Binance is a large crypto exchange.",
        "Never leave all your funds on a centralized exchange.",
        "We use an exchange to convert dollars to euros."
    ],
    184: [
        "Many say the NFT market was a bubble.",
        "When the dot-com bubble burst, many companies failed.",
        "Housing prices are in a bubble right now."
    ],
    185: [
        "Musicians earn royalties from streaming services.",
        "NFT creators can earn royalties on future sales.",
        "The author lives off his book royalties."
    ],
    186: [
        "The distribution of wealth is unequal.",
        "Linux distribution varies by user preference.",
        "The distribution of the vaccine took months."
    ],
    187: [
        "He has sole ownership of the patent.",
        "Blockchain gives you sole ownership of your assets.",
        "Sole ownership means you make all the decisions."
    ],
    188: [
        "The company has a valuation of one billion dollars.",
        "Analysts questioned the high valuation of the startup.",
        "What is the current market valuation of Apple?"
    ],
    189: [
        "Traffic to the site began to surge after the ad.",
        "A power surge can damage your computer.",
        "We saw a surge in cyberattacks last month."
    ],
    190: [
        "Is the metaverse the future or just a fad?",
        "Tamagotchis were a huge fad in the 90s.",
        "This diet is likely just a passing fad."
    ],
    191: [
        "The SEC regulates the trading of securities.",
        "Tokens might be classified as unregistered securities.",
        "He works in the securities market."
    ],
    192: [
        "The stock market crash led to a global recession.",
        "Tech spending often slows down during a recession.",
        "Many people lost their jobs in the last recession."
    ],
    193: [
        "The Ponzi scheme showed counterfeit returns to investors.",
        "He went to jail for faking counterfeit returns.",
        "Be wary of investment funds promising counterfeit returns."
    ],
    194: [
        "They tout their new coin as the next Bitcoin.",
        "Companies tout AI as the solution to everything.",
        "He likes to tout his own achievements."
    ],
    195: [
        "DeFi stands for decentralized finance.",
        "A decentralized network has no single point of failure.",
        "Decentralized apps run on the blockchain."
    ],

    // ACADEMIC VERBS
    196: [
        "We need to analyze the log files.",
        "Algorithms analyze data to find patterns.",
        "Experts analyze the malware to find its source."
    ],
    197: [
        "Use a scanner to assess the vulnerability.",
        "We must assess the damage after the attack.",
        "Assess the risks before opening the attachment."
    ],
    198: [
        "Compare the performance of the two processors.",
        "Can you compare Python with Java?",
        "Compare the security features of both apps."
    ],
    199: [
        "Contrast the security of Linux versus Windows.",
        "The contrast between the two screens is obvious.",
        "Contrast the user experience of the old and new design."
    ],
    200: [
        "First, we must define the project scope.",
        "Dictionaries define words.",
        "Can you define what you mean by 'hacking'?"
    ],
    201: [
        "The demo will demonstrate how the exploit works.",
        "I will demonstrate the new features tomorrow.",
        "Let me demonstrate how to set up the VPN."
    ],
    202: [
        "Evaluate the effectiveness of the firewall.",
        "Teachers evaluate students based on exams.",
        "We need to evaluate the cost of the new server."
    ],
    203: [
        "Examine the code for potential bugs.",
        "Doctors examine patients carefully.",
        "Forensic teams examine the hard drive for evidence."
    ],
    204: [
        "Can you explain how the algorithm works?",
        "Please explain the error message.",
        "It is hard to explain technical concepts to laymen."
    ],
    205: [
        "The system helps to identify phishing emails.",
        "Can you identify the person in this photo?",
        "We must identify the source of the leak."
    ],
    206: [
        "This diagram will illustrate the network topology.",
        "Examples help to illustrate difficult concepts.",
        "Let me illustrate the problem with a screenshot."
    ],
    207: [
        "It is hard to interpret these raw data results.",
        "Computers interpret binary code.",
        "How do you interpret the user's behavior?"
    ],
    208: [
        "Police investigate cybercrimes thoroughly.",
        "Scientists investigate the causes of climate change.",
        "We need to investigate why the server crashed."
    ],
    209: [
        "Outline the steps for disaster recovery.",
        "Draw an outline of the plan first.",
        "Briefly outline the main features of the app."
    ],
    210: [
        "I would like to propose a new security protocol.",
        "Engineers propose solutions to problems.",
        "They propose to ban all USB sticks."
    ],
    211: [
        "You must report any suspicious activity.",
        "The news report covered the data breach.",
        "Users report bugs on the forum."
    ],
    212: [
        "Please review the user logs.",
        "Managers review employee performance annually.",
        "Security experts review the code for flaws."
    ],
    213: [
        "Summarize the findings of the penetration test.",
        "Can you summarize the article in one sentence?",
        "To summarize, we need better passwords."
    ],
    214: [
        "AI can synthesize data from multiple sources.",
        "Plants synthesize sunlight into energy.",
        "Synthesize the feedback into a single report."
    ],
    215: [
        "These logs support the theory of an insider attack.",
        "Technical support is available 24/7.",
        "Evidence must support your claim."
    ],
    216: [
        "We need to test the backup system.",
        "Software must undergo rigorous test procedures.",
        "Test the connection speed."
    ],
    217: [
        "Validate the user input to prevent SQL injection.",
        "You must validate your email address.",
        "The system validates the checksum of the file."
    ],
    218: [
        "These attacks exemplify the need for better security.",
        "His actions exemplify true leadership.",
        "This case will exemplify the risks of poor encryption."
    ],
    219: [
        "How do you justify the cost of this software?",
        "You cannot justify hacking as 'just for fun'.",
        "Can you justify the need for root access?"
    ],
    220: [
        "Experts criticize the app for its weak privacy.",
        "It is easy to criticize others' code.",
        "Users criticize the new interface design."
    ]
};