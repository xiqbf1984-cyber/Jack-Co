'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { matchRole } from '@/lib/constants';
import SearchPage from '@/components/role-creation/search-page';
import ChatPanel from '@/components/role-creation/chat-panel';
import JDCanvas from '@/components/role-creation/jd-canvas';
import SaveSuccessModal from '@/components/role-creation/save-success-modal';

var STAGES = [
  { key: 'describe', label: 'Describe' },
  { key: 'refine', label: 'Refine' },
  { key: 'jd-ready', label: 'JD Ready' },
];


// ─── Smart Input Analysis ───
function analyzeInput(text) {
  var lower = text.toLowerCase();
  var extracted = {
    title: null,
    responsibilities: [],
    skills: [],
    experience: null,
    location: null,
    workMode: null,
    fullPart: null,
    salary: null,
  };

  // Title detection
  var titlePatterns = [
    /(?:looking for|hiring|need|want)\s+(?:a|an)\s+(.+?)(?:\.|,|to|who|with|$)/i,
    /^(.+?)\s*[-–—]\s*/i,
    /(?:role|position|job)(?:\s+(?:of|for|as))?\s*:?\s*(.+?)(?:\.|,|$)/i,
  ];
  for (var i = 0; i < titlePatterns.length; i++) {
    var m = text.match(titlePatterns[i]);
    if (m) {
      extracted.title = m[1].trim().replace(/^(a|an)\s+/i, '');
      break;
    }
  }

  // Skills detection
  var skillKeywords = ['python', 'javascript', 'typescript', 'react', 'node', 'pytorch', 'tensorflow',
    'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'sql', 'nosql', 'java', 'go', 'rust',
    'machine learning', 'deep learning', 'nlp', 'computer vision', 'data science',
    'system design', 'distributed systems', 'ci/cd', 'mlops', 'devops',
    'rlhf', 'llm', 'transformer', 'fine-tuning', 'prompt engineering'];
  skillKeywords.forEach(function (skill) {
    if (lower.includes(skill)) extracted.skills.push(skill);
  });

  // Experience level
  if (/(\d+)\+?\s*(?:years?|yrs?)/i.test(text)) {
    var years = parseInt(RegExp.$1);
    if (years <= 2) extracted.experience = 'Junior (1-2 years)';
    else if (years <= 4) extracted.experience = 'Mid-level (3-4 years)';
    else if (years <= 7) extracted.experience = 'Senior (5-7 years)';
    else extracted.experience = 'Staff+ (8+ years)';
  } else if (/\b(junior|entry)\b/i.test(text)) extracted.experience = 'Junior (1-2 years)';
  else if (/\b(senior|sr\.?)\b/i.test(text)) extracted.experience = 'Senior (5-7 years)';
  else if (/\b(staff|principal|lead)\b/i.test(text)) extracted.experience = 'Staff+ (8+ years)';

  // Location
  var locationMatch = text.match(/(?:based in|located in|location:\s*|in\s+)([A-Z][a-zA-Z\s,]+)/);
  if (locationMatch) extracted.location = locationMatch[1].trim();

  // Work mode
  if (/\bremote\b/i.test(text)) extracted.workMode = 'Remote';
  else if (/\bhybrid\b/i.test(text)) extracted.workMode = 'Hybrid';
  else if (/\b(on-?site|in-?office|in office)\b/i.test(text)) extracted.workMode = 'On-site';

  // Salary
  var salaryMatch = text.match(/\$[\d,]+k?\s*[-–—]\s*\$?[\d,]+k?/i);
  if (salaryMatch) extracted.salary = salaryMatch[0];

  // Responsibilities (look for bullet-like patterns)
  var respPatterns = text.match(/(?:will|should|responsible for|own|lead|build|design|develop|manage|drive)\s+[^.!?]+/gi);
  if (respPatterns) extracted.responsibilities = respPatterns.slice(0, 5);

  // Coverage assessment
  var coverage = {
    roleDefinition: !!(extracted.title || extracted.responsibilities.length > 0),
    candidateProfile: !!(extracted.skills.length > 0 || extracted.experience),
    basicConditions: !!(extracted.location || extracted.workMode),
  };

  return { extracted: extracted, coverage: coverage };
}

// ─── Generate the NEXT single follow-up question ───
function getNextQuestion(coverage, extracted) {
  // Ask ONE question at a time, in priority order
  if (!coverage.roleDefinition) {
    if (!extracted.title) {
      return 'What\'s the job title for this role?';
    }
    return 'What will this person mainly own or be responsible for?';
  }

  if (!extracted.experience) {
    return 'What experience level are you looking for — junior, mid, senior, or staff+?';
  }

  if (extracted.skills.length === 0) {
    return 'What are the must-have technical skills for this role?';
  }

  if (!coverage.basicConditions) {
    return 'Is this remote, hybrid, or on-site?';
  }

  // All essentials covered — generate JD
  return null;
}

// ─── Generate JD ───
function generateJD(extracted, matched, company, allText) {
  var title = extracted.title || (matched ? matched.title : 'Open Role');
  var companyName = company?.name && company.name !== 'Your Company' ? company.name : null;
  var companyDesc = company?.description || '';
  var location = extracted.location || '[Location TBD]';
  var workMode = extracted.workMode || '';
  var experience = extracted.experience || '';

  var lines = [];

  // Header
  if (companyName) {
    lines.push('# ' + title);
    lines.push('**' + companyName + '** | ' + location + (workMode ? ' | ' + workMode : ''));
  } else {
    lines.push('# ' + title);
    lines.push(location + (workMode ? ' | ' + workMode : ''));
  }

  // About Company
  if (companyName && companyDesc) {
    lines.push('', '## About ' + companyName, '', companyDesc);
  } else if (companyName) {
    lines.push('', '## About ' + companyName, '', '[Company description to be added]');
  }

  // About the Role
  lines.push('', '## About the Role', '');
  var roleContext = extracted.responsibilities.length > 0
    ? 'This role focuses on ' + extracted.responsibilities[0].toLowerCase().replace(/^(will|should)\s+/i, '') + '.'
    : 'We are looking for a ' + title + ' to join our team.';
  lines.push('We are hiring a **' + title + '** to strengthen our team. ' + roleContext + ' This is a ' + (experience || 'mid-to-senior level') + ' position reporting to the engineering/product leadership.');

  // What You'll Do
  lines.push('', '## What You\'ll Do', '');
  if (extracted.responsibilities.length > 0) {
    extracted.responsibilities.forEach(function (r) {
      var clean = r.replace(/^(will|should|responsible for)\s+/i, '').trim();
      clean = clean.charAt(0).toUpperCase() + clean.slice(1);
      lines.push('- ' + clean);
    });
  }
  // Add generic responsibilities based on role type
  var generic = [
    'Collaborate cross-functionally with engineering, product, and design teams',
    'Contribute to technical direction and architectural decisions',
    'Participate in code reviews and maintain high engineering standards',
    'Mentor team members and foster a culture of continuous learning',
  ];
  var needed = Math.max(0, 5 - extracted.responsibilities.length);
  for (var g = 0; g < needed && g < generic.length; g++) {
    lines.push('- ' + generic[g]);
  }

  // What We're Looking For
  lines.push('', '## What We\'re Looking For', '', '### Must Have', '');
  if (extracted.skills.length > 0) {
    lines.push('- Strong proficiency in ' + extracted.skills.slice(0, 3).join(', '));
    if (extracted.skills.length > 3) {
      lines.push('- Experience with ' + extracted.skills.slice(3).join(', '));
    }
  }
  if (extracted.experience) {
    lines.push('- ' + extracted.experience + ' of relevant professional experience');
  }
  lines.push('- Strong problem-solving skills and ability to work independently');
  lines.push('- Excellent written and verbal communication skills');

  lines.push('', '### Nice to Have', '');
  lines.push('- Experience in a fast-paced startup or scale-up environment');
  lines.push('- Open-source contributions or technical blog posts');
  lines.push('- Familiarity with modern AI/ML tools and methodologies');

  // Compensation
  if (extracted.salary) {
    lines.push('', '## Compensation', '', 'Salary range: ' + extracted.salary + ' (depending on experience)');
  }

  // Why Join Us
  if (companyName) {
    lines.push('', '## Why Join ' + companyName, '');
    lines.push('- Work on cutting-edge technology with a talented team');
    lines.push('- Competitive compensation and equity package');
    lines.push('- Professional development budget and growth opportunities');
    lines.push('- Collaborative and inclusive team culture');
  }

  return lines.join('\n');
}

function inferDepartment(extracted, allText) {
  var text = ((extracted.title || '') + ' ' + allText).toLowerCase();
  if (text.includes('research') || text.includes('scientist')) return 'Research';
  if (text.includes('platform') || text.includes('infrastructure') || text.includes('devops')) return 'Infrastructure';
  if (text.includes('product') || text.includes('manager')) return 'Product';
  if (text.includes('data')) return 'Data';
  if (text.includes('nlp') || text.includes('language')) return 'NLP';
  if (text.includes('frontend') || text.includes('front-end')) return 'Frontend';
  if (text.includes('backend') || text.includes('back-end')) return 'Backend';
  if (text.includes('fullstack') || text.includes('full-stack') || text.includes('full stack')) return 'Engineering';
  return 'Engineering';
}

function ProgressIndicator({ currentStage }) {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {STAGES.map(function (stage, i) {
        var isCurrent = i === currentStage;
        var isDone = i < currentStage;
        var barColor = isDone ? 'var(--accent-green)' : isCurrent ? 'var(--gold)' : 'var(--border-light)';
        var labelColor = isDone ? 'var(--accent-green)' : isCurrent ? 'var(--brown)' : 'var(--brown-light)';
        var labelWeight = isCurrent ? 600 : 400;
        return (
          <div key={stage.key} style={{ flex: 1 }}>
            <div style={{ height: 3, borderRadius: 2, backgroundColor: barColor, transition: 'background-color 0.3s ease' }} />
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: labelWeight,
              marginTop: 6, textAlign: 'center', color: labelColor,
              userSelect: 'none', transition: 'color 0.2s ease',
              letterSpacing: '0.01em',
            }}>{stage.label}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function RoleCreatePage() {
  var router = useRouter();
  var addRole = useAppStore(function (s) { return s.addRole; });
  var company = useAppStore(function (s) { return s.company; });
  var addNotification = useAppStore(function (s) { return s.addNotification; });

  var [stage, setStage] = useState(0);
  var [messages, setMessages] = useState([]);
  var [isTyping, setIsTyping] = useState(false);
  var [jdContent, setJDContent] = useState('');
  var [jdPortalTarget, setJDPortalTarget] = useState(null);
  var [description, setDescription] = useState('');
  var [matchedRole, setMatchedRole] = useState(null);
  var [matchScore, setMatchScore] = useState(0);
  var [showSuccessModal, setShowSuccessModal] = useState(false);
  var [savedRoleTitle, setSavedRoleTitle] = useState('');
  var [bodyEl, setBodyEl] = useState(null);
  var [allText, setAllText] = useState('');
  var [extractedData, setExtractedData] = useState(null);
  var [followUpRound, setFollowUpRound] = useState(0);
  var [jdGenerated, setJdGenerated] = useState(false);
  var [sharableLink] = useState(function () {
    return 'https://assess.jack-co.com/jd/' + Math.random().toString(36).slice(2, 10);
  });

  useEffect(function () { setBodyEl(document.body); }, []);

  useEffect(function () {
    if (stage < 2) return;
    var check = function () {
      var el = document.getElementById('jd-canvas-panel');
      if (el) setJDPortalTarget(el);
    };
    check();
    var timer = setInterval(check, 100);
    return function () { clearInterval(timer); };
  }, [stage]);

  useEffect(function () {
    if (stage >= 2) {
      window.dispatchEvent(new CustomEvent('jd-panel-toggle', { detail: { visible: true } }));
    }
    return function () {
      window.dispatchEvent(new CustomEvent('jd-panel-toggle', { detail: { visible: false } }));
    };
  }, [stage]);

  var doMatch = useCallback(function (text) {
    var result = matchRole(text);
    setMatchedRole(result.role);
    setMatchScore(result.score);
    return result;
  }, []);

  var addAIMessage = useCallback(function (content) {
    setIsTyping(true);
    var delay = 600 + Math.random() * 400;
    setTimeout(function () {
      setMessages(function (prev) { return prev.concat([{ role: 'ai', content: content }]); });
      setIsTyping(false);
    }, delay);
  }, []);

  function handleSearchSubmit(text) {
    setDescription(text);
    setAllText(text);

    var analysis = analyzeInput(text);
    setExtractedData(analysis.extracted);
    setStage(1);
    var matchResult = doMatch(text);
    setMessages([{ role: 'user', content: text }]);

    if (matchResult.role) {
      analysis.extracted.title = analysis.extracted.title || matchResult.role.title;
    }

    // Ask ONE question at a time
    var nextQ = getNextQuestion(analysis.coverage, analysis.extracted);

    if (!nextQ) {
      var jd = generateJD(analysis.extracted, matchResult.role, company, text);
      setJDContent(jd);
      setJdGenerated(true);
      setStage(2);
      addAIMessage('Your JD is ready! Edit it on the right, or tell me what to change.');
    } else {
      addAIMessage('Got it — I can already picture this role. ' + nextQ);
    }
  }

  function handleChatSend(text) {
    setMessages(function (prev) { return prev.concat([{ role: 'user', content: text }]); });

    var newAllText = allText + ' ' + text;
    setAllText(newAllText);

    // Re-analyze with new info
    var analysis = analyzeInput(newAllText);
    setExtractedData(analysis.extracted);

    var matchResult = doMatch(newAllText);
    if (matchResult.role) {
      analysis.extracted.title = analysis.extracted.title || matchResult.role.title;
    }

    var round = followUpRound + 1;
    setFollowUpRound(round);

    // Ask next single question, or generate JD if all covered (max 5 rounds)
    var nextQ = round < 5 ? getNextQuestion(analysis.coverage, analysis.extracted) : null;

    if (!nextQ || round >= 5) {
      var jd = generateJD(analysis.extracted, matchResult.role, company, newAllText);
      setJDContent(jd);
      setJdGenerated(true);
      if (stage < 2) setStage(2);
      addAIMessage('Your JD is ready! Edit it on the right, or tell me what to change.');
    } else {
      // Update JD preview if we're already in stage 2
      if (stage >= 2) {
        var updatedJd = generateJD(analysis.extracted, matchResult.role, company, newAllText);
        setJDContent(updatedJd);
      }
      addAIMessage('Thanks! ' + nextQ);
    }
  }

  function handleSaveRole() {
    if (!jdContent.trim()) return;
    var title = extractedData?.title || (matchedRole ? matchedRole.title : description.slice(0, 40));
    addRole({
      title: title,
      dept: inferDepartment(extractedData || {}, allText),
      salary: extractedData?.salary || 'TBD',
      status: 'active',
      roleRef: matchedRole,
      jd: jdContent,
      sharableLink: sharableLink,
    });
    addNotification({ type: 'role', title: 'Role created', message: title + ' is now active' });
    setSavedRoleTitle(title);
    setShowSuccessModal(true);
  }

  function handleCreateAnother() {
    setShowSuccessModal(false);
    setStage(0);
    setMessages([]);
    setJDContent('');
    setDescription('');
    setMatchedRole(null);
    setMatchScore(0);
    setJDPortalTarget(null);
    setAllText('');
    setExtractedData(null);
    setFollowUpRound(0);
    setJdGenerated(false);
  }

  function handleGoToAssessment() {
    router.push('/assessment/create');
  }

  function handleStay() {
    setShowSuccessModal(false);
  }

  var isCompact = stage >= 2;

  function handleBack() {
    if (stage === 0) {
      router.push('/roles');
    } else if (stage === 1 && messages.length <= 2) {
      setStage(0);
      setMessages([]);
      setAllText('');
      setExtractedData(null);
      setFollowUpRound(0);
    } else {
      router.push('/roles');
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Header — sticky so chat scrolls beneath it */}
      <div id="role-create-header" style={{ flexShrink: 0, backgroundColor: 'var(--cream)', zIndex: 10, position: 'sticky', top: 0 }}>
        <div style={{ padding: '14px 24px 0' }}>
          <button
            onClick={handleBack}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 10,
            }}
          >
            <ArrowLeft size={13} />
            Back to Roles
          </button>
          <h1 style={{ fontFamily: 'var(--font-body)', fontSize: 18, fontWeight: 600, color: 'var(--brown)', marginBottom: 2 }}>Create a Role</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', marginBottom: 12 }}>Describe your role and we'll generate a professional job description</p>
        </div>
        <div style={{ padding: '0 24px 8px', borderBottom: '1px solid var(--border-default)' }}>
          <ProgressIndicator currentStage={stage} />
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {stage === 0 && <SearchPage onSubmit={handleSearchSubmit} />}

        {stage >= 1 && (
          <div style={{ height: '100%', display: 'flex', justifyContent: 'center' }}>
            <div style={{ height: '100%', width: '100%', maxWidth: isCompact ? undefined : 660, minWidth: 0 }}>
              <ChatPanel
                messages={messages}
                onSend={handleChatSend}
                currentQuestion={null}
                isTyping={isTyping}
                compact={isCompact}
              />
            </div>
          </div>
        )}
      </div>

      {/* JD Canvas */}
      {stage >= 2 &&
        jdPortalTarget &&
        createPortal(
          <div className="h-full p-4">
            <JDCanvas
              content={jdContent}
              onChange={setJDContent}
              onSave={handleSaveRole}
              matchedRoleName={matchedRole ? matchedRole.title : null}
              matchScore={matchScore}
              sharableLink={sharableLink}
              portalTarget={bodyEl}
            />
          </div>,
          jdPortalTarget
        )}

      {/* Success modal */}
      {showSuccessModal && bodyEl &&
        createPortal(
          <SaveSuccessModal
            roleTitle={savedRoleTitle}
            onCreateAnother={handleCreateAnother}
            onGoToAssessment={handleGoToAssessment}
            onStay={handleStay}
          />,
          bodyEl
        )}
    </div>
  );
}
