'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { ArrowLeft, Save, Download, Link2, Plus, Play } from 'lucide-react';
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

  // Skills detection — broad matching
  var skillKeywords = ['python', 'javascript', 'typescript', 'react', 'node', 'pytorch', 'tensorflow',
    'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'sql', 'nosql', 'java', 'go', 'rust',
    'machine learning', 'deep learning', 'nlp', 'computer vision', 'data science',
    'system design', 'distributed systems', 'ci/cd', 'mlops', 'devops',
    'rlhf', 'llm', 'transformer', 'fine-tuning', 'prompt engineering',
    'coding', 'programming', 'engineering', 'design', 'product', 'management',
    'communication', 'leadership', 'analytics', 'modeling', 'writing',
    'c++', 'swift', 'kotlin', 'ruby', 'php', 'scala', 'html', 'css',
    'figma', 'sketch', 'adobe', 'excel', 'tableau', 'power bi',
    'agile', 'scrum', 'kanban', 'jira', 'git', 'linux'];
  skillKeywords.forEach(function (skill) {
    if (lower.includes(skill)) extracted.skills.push(skill);
  });
  // Treat any answer longer than 2 chars during skills question as a skill
  if (extracted.skills.length === 0 && lower.length > 2 && lower !== 'good' && lower !== 'yes') {
    extracted.skills.push(lower.trim());
  }

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

  // Work mode — also catch common variations
  if (/\bremote\b/i.test(text)) extracted.workMode = 'Remote';
  else if (/\bhybrid\b/i.test(text)) extracted.workMode = 'Hybrid';
  else if (/\b(on-?site|in-?office|in office|office)\b/i.test(text)) extracted.workMode = 'On-site';
  else if (/\b(flexible|any|doesn.?t matter|no preference|good|ok|sure|yes)\b/i.test(text)) extracted.workMode = 'Flexible';

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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
      {STAGES.map(function (stage, i) {
        var isCurrent = i === currentStage;
        var isDone = i < currentStage;
        var numColor = isDone ? 'var(--accent-green)' : isCurrent ? 'var(--gold)' : 'var(--brown-light)';
        var labelColor = isDone ? 'var(--accent-green)' : isCurrent ? 'var(--brown)' : 'var(--brown-light)';
        var numBg = isDone ? 'rgba(39,130,91,0.1)' : isCurrent ? 'rgba(139,105,20,0.1)' : 'transparent';
        var numBorder = isDone ? 'rgba(39,130,91,0.3)' : isCurrent ? 'rgba(139,105,20,0.3)' : 'var(--border-default)';
        return (
          <div key={stage.key} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && (
              <div style={{
                width: 32, height: 1,
                backgroundColor: isDone ? 'var(--accent-green)' : 'var(--border-default)',
                margin: '0 8px',
                transition: 'background-color 0.2s ease',
              }} />
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                border: '1.5px solid ' + numBorder,
                backgroundColor: numBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600,
                color: numColor,
                transition: 'all 0.2s ease',
              }}>{i + 1}</div>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: isCurrent ? 600 : 400,
                color: labelColor, userSelect: 'none', transition: 'color 0.2s ease',
                whiteSpace: 'nowrap',
              }}>{stage.label}</span>
            </div>
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
  var [saveVersion, setSaveVersion] = useState(0);
  var [agentSessionId, setAgentSessionId] = useState(null);
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

  // ─── Send message to Neo agent ───
  async function sendToAgent(text, sessionId, isFirst) {
    var payload = { message: text, sessionId: sessionId };
    // On first message, inject company context
    if (isFirst && company) {
      payload.companyContext = {
        name: company.name || '',
        industry: company.industry || '',
        size: company.size || '',
        location: company.location || '',
        description: company.description || '',
      };
    }

    var res = await fetch('/api/generate-jd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Agent API error: ' + res.status);

    var reader = res.body.getReader();
    var decoder = new TextDecoder();
    var fullText = '';
    var newSessionId = sessionId;
    var buffer = '';

    while (true) {
      var result = await reader.read();
      if (result.done) break;
      buffer += decoder.decode(result.value, { stream: true });
      var parts = buffer.split('\n\n');
      buffer = parts.pop();
      for (var p = 0; p < parts.length; p++) {
        var eventLines = parts[p].split('\n');
        for (var k = 0; k < eventLines.length; k++) {
          var line = eventLines[k].trim();
          if (!line.startsWith('data: ')) continue;
          try {
            var evt = JSON.parse(line.slice(6));
            if (evt.type === 'session') newSessionId = evt.sessionId;
            if (evt.type === 'chat' && evt.text) fullText += evt.text;
            if (evt.type === 'done' && evt.fullText) fullText = evt.fullText;
            if (evt.type === 'error') console.error('Agent error:', evt.text);
          } catch (e) { /* skip */ }
        }
      }
    }
    return { sessionId: newSessionId, text: fullText };
  }

  // Check if response contains JD content
  function looksLikeJD(text) {
    var headerCount = (text.match(/^#{1,3}\s+/gm) || []).length;
    var hasRoleKeywords = /about the role|what you.ll do|looking for|responsibilities|requirements|key responsibilities/i.test(text);
    return headerCount >= 3 && text.length > 400 && hasRoleKeywords;
  }

  function handleSearchSubmit(text) {
    setDescription(text);
    setAllText(text);

    // Local analysis for hiring brief metadata
    var analysis = analyzeInput(text);
    setExtractedData(analysis.extracted);
    var matchResult = doMatch(text);
    if (matchResult.role) {
      analysis.extracted.title = analysis.extracted.title || matchResult.role.title;
    }

    setStage(1);
    setMessages([{ role: 'user', content: text }]);
    setIsTyping(true);

    sendToAgent(text, null, true).then(function (result) {
      setAgentSessionId(result.sessionId);
      setIsTyping(false);

      if (looksLikeJD(result.text)) {
        setJDContent(result.text);
        setJdGenerated(true);
        setStage(2);
        setMessages(function (prev) { return prev.concat([{ role: 'ai', content: 'Your JD is ready! Edit it on the right, or tell me what to change.' }]); });
      } else {
        setMessages(function (prev) { return prev.concat([{ role: 'ai', content: result.text }]); });
      }
    }).catch(function (err) {
      console.error('Agent error, falling back to local:', err);
      setIsTyping(false);
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
    });
  }

  function handleChatSend(text) {
    setMessages(function (prev) { return prev.concat([{ role: 'user', content: text }]); });

    var newAllText = allText + ' ' + text;
    setAllText(newAllText);

    // Update local analysis for hiring brief
    var analysis = analyzeInput(newAllText);
    setExtractedData(analysis.extracted);
    var matchResult = doMatch(newAllText);
    if (matchResult.role) {
      analysis.extracted.title = analysis.extracted.title || matchResult.role.title;
    }

    var round = followUpRound + 1;
    setFollowUpRound(round);
    setIsTyping(true);

    sendToAgent(text, agentSessionId, false).then(function (result) {
      setAgentSessionId(result.sessionId);
      setIsTyping(false);

      if (looksLikeJD(result.text)) {
        setJDContent(result.text);
        setJdGenerated(true);
        if (stage < 2) setStage(2);
        setMessages(function (prev) { return prev.concat([{ role: 'ai', content: 'Your JD is ready! Edit it on the right, or tell me what to change.' }]); });
      } else {
        setMessages(function (prev) { return prev.concat([{ role: 'ai', content: result.text }]); });
        if (stage >= 2 && result.text.length > 400) {
          setJDContent(result.text);
        }
      }
    }).catch(function (err) {
      console.error('Agent error, falling back to local:', err);
      setIsTyping(false);
      var nextQ = round < 3 ? getNextQuestion(analysis.coverage, analysis.extracted) : null;
      if (!nextQ || round >= 3) {
        var jd = generateJD(analysis.extracted, matchResult.role, company, newAllText);
        setJDContent(jd);
        setJdGenerated(true);
        if (stage < 2) setStage(2);
        addAIMessage('Your JD is ready! Edit it on the right, or tell me what to change.');
      } else {
        addAIMessage('Thanks! ' + nextQ);
      }
    });
  }

  function handleSaveRole() {
    if (!jdContent.trim()) return;
    var title = extractedData?.title || (matchedRole ? matchedRole.title : description.slice(0, 40));
    var newVersion = saveVersion + 1;
    setSaveVersion(newVersion);
    addRole({
      title: title,
      dept: inferDepartment(extractedData || {}, allText),
      salary: extractedData?.salary || 'TBD',
      status: 'active',
      roleRef: matchedRole,
      jd: jdContent,
      sharableLink: sharableLink,
    });
    addNotification({ type: 'role', title: 'Role saved', message: title + ' v' + newVersion });
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
    setAgentSessionId(null);
  }

  function handleGoToAssessment() {
    router.push('/assessment/create');
  }

  function handleStay() {
    setShowSuccessModal(false);
  }

  function handleDownloadJD() {
    if (!jdContent.trim()) return;
    var name = extractedData?.title || (matchedRole ? matchedRole.title : 'job-description');
    var blob = new Blob([jdContent], { type: 'text/markdown;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = name.replace(/\s+/g, '-').toLowerCase() + '.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  var [showShareModal, setShowShareModal] = useState(false);
  function handleShareJD() {
    setShowShareModal(true);
  }

  var isCompact = stage >= 2;

  var hiringBrief = useMemo(function () {
    if (!extractedData) return null;
    return {
      title: extractedData.title || (matchedRole ? matchedRole.title : ''),
      department: inferDepartment(extractedData, allText),
      experience: extractedData.experience || '',
      workMode: extractedData.workMode || '',
      location: extractedData.location || '',
      salary: extractedData.salary || '',
      skills: extractedData.skills || [],
      responsibilities: extractedData.responsibilities || [],
      companyName: company?.name && company.name !== 'Your Company' ? company.name : '',
      companyIndustry: company?.industry || '',
      matchedRoleName: matchedRole ? matchedRole.title : '',
      matchScore: matchScore,
    };
  }, [extractedData, matchedRole, matchScore, allText, company]);

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
      overflow: isCompact ? 'visible' : 'hidden',
    }}>
      {/* Header — sticky, spans full layout width in split mode */}
      <div id="role-create-header" style={{
        flexShrink: 0, backgroundColor: 'var(--cream)', zIndex: 10, position: 'sticky', top: 0,
        width: isCompact ? 'var(--full-width-pct, 238%)' : '100%',
      }}>
        {/* Top bar: back + actions */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px',
        }}>
          <button
            onClick={handleBack}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            <ArrowLeft size={13} />
            Back to Roles
          </button>

          {/* Right: version + save group + primary action */}
          {isCompact && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Version indicator */}
              {saveVersion > 0 && (
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: 11,
                  color: 'var(--brown-light)',
                }}>v{saveVersion}</span>
              )}

              {/* Save button group */}
              <div style={{
                display: 'flex', alignItems: 'center',
                border: '1px solid var(--border-default)',
                borderRadius: 7, overflow: 'hidden',
              }}>
                <button
                  type="button" onClick={handleSaveRole} disabled={!jdContent.trim()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '5px 10px', border: 'none', background: 'transparent',
                    fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
                    color: !jdContent.trim() ? 'var(--brown-light)' : 'var(--brown-soft)',
                    cursor: !jdContent.trim() ? 'default' : 'pointer',
                  }}
                >
                  Save
                </button>
                <div style={{ width: 1, height: 16, backgroundColor: 'var(--border-default)' }} />
                <button type="button" onClick={handleDownloadJD} disabled={!jdContent.trim()}
                  title="Download" style={{
                    display: 'flex', alignItems: 'center', padding: '5px 7px',
                    border: 'none', background: 'transparent', cursor: !jdContent.trim() ? 'default' : 'pointer',
                    color: !jdContent.trim() ? 'var(--brown-light)' : 'var(--brown-soft)',
                  }}>
                  <Download size={12} />
                </button>
                <div style={{ width: 1, height: 16, backgroundColor: 'var(--border-default)' }} />
                <button type="button" onClick={function () { handleShareJD(); }} disabled={!sharableLink}
                  title="Share" style={{
                    display: 'flex', alignItems: 'center', padding: '5px 7px',
                    border: 'none', background: 'transparent', cursor: 'pointer',
                    color: 'var(--brown-soft)',
                  }}>
                  <Link2 size={12} />
                </button>
              </div>

              {/* Create Assessment — primary */}
              <button
                type="button" onClick={handleGoToAssessment} disabled={!jdContent.trim()}
                className="btn-primary"
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 12px', fontSize: 11,
                  opacity: !jdContent.trim() ? 0.5 : 1,
                  whiteSpace: 'nowrap',
                }}
              >
                <Play size={10} fill="currentColor" />
                Create an Assessment
              </button>
            </div>
          )}
        </div>

        {/* Progress bar — centered, no border */}
        <div style={{ padding: '0 24px 12px' }}>
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
          <JDCanvas
            content={jdContent}
            onChange={setJDContent}
            hiringBrief={hiringBrief}
            matchedRoleName={matchedRole ? matchedRole.title : null}
            matchScore={matchScore}
          />,
          jdPortalTarget
        )}

      {/* Share modal */}
      {showShareModal && bodyEl &&
        createPortal(
          <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'rgba(26,22,18,0.35)',
            backdropFilter: 'blur(8px)',
          }} onClick={function () { setShowShareModal(false); }}>
            <div style={{
              background: '#fff', borderRadius: 16, padding: '24px', width: '100%', maxWidth: 420,
              boxShadow: 'var(--shadow-modal)', animation: 'fadeScale 0.2s ease both',
            }} onClick={function (e) { e.stopPropagation(); }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700, color: 'var(--brown)' }}>Share this JD</h3>
                <button onClick={function () { setShowShareModal(false); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--brown-soft)', padding: 4 }}>×</button>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input readOnly value={sharableLink}
                  style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--border-default)', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown)', background: 'var(--cream)', outline: 'none' }}
                  onFocus={function (e) { e.target.select(); }}
                />
                <button onClick={function () { navigator.clipboard.writeText(sharableLink); }} className="btn-primary" style={{ padding: '10px 18px', fontSize: 12, flexShrink: 0 }}>
                  Copy
                </button>
              </div>
            </div>
          </div>,
          bodyEl
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
