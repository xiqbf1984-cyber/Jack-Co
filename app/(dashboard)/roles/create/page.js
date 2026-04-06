'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { ROLE_CREATION_QUESTIONS, AI_ACKS, matchRole } from '@/lib/constants';
import SearchPage from '@/components/role-creation/search-page';
import ChatPanel from '@/components/role-creation/chat-panel';
import JDCanvas from '@/components/role-creation/jd-canvas';
import SaveSuccessModal from '@/components/role-creation/save-success-modal';

var STAGES = [
  { key: 'describe', label: 'Describe' },
  { key: 'refine', label: 'Refine' },
  { key: 'jd-ready', label: 'JD Ready' },
];

function inferDepartment(answers) {
  var text = ((answers.title || '') + ' ' + (answers.own || '')).toLowerCase();
  if (text.includes('research') || text.includes('scientist')) return 'Research';
  if (text.includes('platform') || text.includes('infrastructure') || text.includes('devops')) return 'Infrastructure';
  if (text.includes('product') || text.includes('manager')) return 'Product';
  if (text.includes('data')) return 'Data';
  if (text.includes('nlp') || text.includes('language')) return 'NLP';
  return 'Engineering';
}

function generateJD(answers, matched, company) {
  var title = answers.title || (matched ? matched.title : 'Open Role');
  var oneLiner = matched ? matched.oneLiner : '';
  var companyName = company?.name || 'Your Company';
  var companyDesc = company?.description || 'We are a forward-thinking technology company building cutting-edge AI solutions.';

  var ownership = answers.own || 'core AI/ML initiatives';
  var skills = answers.skills || 'Strong technical background';
  var level = answers.level || 'Relevant experience level';
  var extras = answers.extra || 'Competitive compensation';

  var lines = [
    '# ' + title,
  ];

  if (oneLiner) {
    lines.push('', '*' + oneLiner + '*');
  }

  lines.push(
    '',
    '## About ' + companyName,
    '',
    companyDesc,
    '',
    '---',
    '',
    '## Role Overview',
    '',
    'We are looking for a **' + title + '** to join our team. This role will focus on ' + ownership.toLowerCase() + ', working cross-functionally to deliver impactful results.',
    '',
    '## Key Responsibilities',
    '',
    '- **Own and lead** ' + ownership,
    '- Collaborate cross-functionally with engineering, product, and design teams',
    '- Drive technical direction and best practices in ' + (answers.skills || 'relevant domain'),
    '- Contribute to strategic planning and roadmap development',
    '- Mentor team members and foster a culture of continuous improvement',
    '',
    '## Required Qualifications',
    '',
    '- **Skills:** ' + skills,
    '- **Experience:** ' + level,
    '- Experience with modern AI/ML tools, frameworks, and methodologies',
    '- Strong communication skills and ability to work in cross-functional teams',
    '- Track record of delivering production-quality work',
    '',
    '## What We Offer',
    '',
    '- ' + extras,
    '- Opportunity to work on cutting-edge technology',
    '- Collaborative and inclusive team environment',
    '- Professional development and growth opportunities',
  );

  return lines.join('\n');
}

function ProgressIndicator({ currentStage }) {
  return (
    <div style={{
      display: 'flex',
      gap: 6,
    }}>
      {STAGES.map(function (stage, i) {
        var isCurrent = i === currentStage;
        var isDone = i < currentStage;

        var barColor = isDone ? 'var(--accent-green)' : isCurrent ? 'var(--gold)' : 'var(--border-default)';
        var labelColor = isDone ? 'var(--accent-green)' : isCurrent ? 'var(--gold)' : 'var(--border-default)';

        return (
          <div key={stage.key} style={{ flex: 1 }}>
            <div style={{ height: 3, borderRadius: 2, backgroundColor: barColor, transition: 'background-color 0.2s ease' }} />
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              marginTop: 5,
              textAlign: 'center',
              color: labelColor,
              userSelect: 'none',
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

  var [stage, setStage] = useState(0);
  var [messages, setMessages] = useState([]);
  var [questionIndex, setQuestionIndex] = useState(0);
  var [isTyping, setIsTyping] = useState(false);
  var [answers, setAnswers] = useState({});
  var [jdContent, setJDContent] = useState('');
  var [jdPortalTarget, setJDPortalTarget] = useState(null);
  var [description, setDescription] = useState('');
  var [matchedRole, setMatchedRole] = useState(null);
  var [matchScore, setMatchScore] = useState(0);
  var [showSuccessModal, setShowSuccessModal] = useState(false);
  var [savedRoleTitle, setSavedRoleTitle] = useState('');
  var [bodyEl, setBodyEl] = useState(null);
  var [sharableLink] = useState(function () {
    return 'https://assess.jack-co.com/jd/' + Math.random().toString(36).slice(2, 10);
  });

  useEffect(function () {
    setBodyEl(document.body);
  }, []);

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
      window.dispatchEvent(
        new CustomEvent('jd-panel-toggle', { detail: { visible: true } })
      );
    }
    return function () {
      window.dispatchEvent(
        new CustomEvent('jd-panel-toggle', { detail: { visible: false } })
      );
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
    var delay = 700 + Math.random() * 500;
    setTimeout(function () {
      setMessages(function (prev) { return prev.concat([{ role: 'ai', content: content }]); });
      setIsTyping(false);
    }, delay);
  }, []);

  function handleSearchSubmit(text) {
    setDescription(text);
    setStage(1);
    doMatch(text);
    setMessages([{ role: 'user', content: text }]);
    addAIMessage(
      'Great, I\'ll help you build this role. ' + ROLE_CREATION_QUESTIONS[0].question
    );
  }

  function handleChatSend(text) {
    var currentQ = ROLE_CREATION_QUESTIONS[questionIndex];
    var newAnswers = Object.assign({}, answers, { [currentQ.id]: text });
    setAnswers(newAnswers);

    setMessages(function (prev) { return prev.concat([{ role: 'user', content: text }]); });

    var allText = description + ' ' + Object.values(newAnswers).join(' ');
    var matchResult = doMatch(allText);

    var nextIndex = questionIndex + 1;

    if (nextIndex >= 3 && stage < 2) {
      setStage(2);
      var jd = generateJD(newAnswers, matchResult.role, company);
      setJDContent(jd);
    }

    setQuestionIndex(nextIndex);

    if (nextIndex < ROLE_CREATION_QUESTIONS.length) {
      if (nextIndex >= 3) {
        var updatedJD = generateJD(newAnswers, matchResult.role, company);
        setJDContent(updatedJD);
      }

      var ack = AI_ACKS[Math.floor(Math.random() * AI_ACKS.length)];
      addAIMessage(ack + ' ' + ROLE_CREATION_QUESTIONS[nextIndex].question);
    } else {
      var finalJD = generateJD(newAnswers, matchResult.role, company);
      setJDContent(finalJD);
      addAIMessage(
        'Your JD is ready! Feel free to edit it on the right. Click Save Role when you\'re done.'
      );
    }
  }

  function handleSaveRole() {
    if (!jdContent.trim()) return;

    var title = answers.title || (matchedRole ? matchedRole.title : description.slice(0, 40));
    addRole({
      title: title,
      dept: inferDepartment(answers),
      salary: answers.extra || 'TBD',
      status: 'active',
      roleRef: matchedRole,
      jd: jdContent,
      sharableLink: sharableLink,
    });
    setSavedRoleTitle(title);
    setShowSuccessModal(true);
  }

  function handleSaveForLater() {
    if (!jdContent.trim()) return;

    var title = answers.title || (matchedRole ? matchedRole.title : description.slice(0, 40));
    addRole({
      title: title,
      dept: inferDepartment(answers),
      salary: answers.extra || 'TBD',
      status: 'draft',
      roleRef: matchedRole,
      jd: jdContent,
      sharableLink: sharableLink,
    });
    setSavedRoleTitle(title);
    setShowSuccessModal(true);
  }

  function handleCreateAnother() {
    setShowSuccessModal(false);
    setStage(0);
    setMessages([]);
    setQuestionIndex(0);
    setAnswers({});
    setJDContent('');
    setDescription('');
    setMatchedRole(null);
    setMatchScore(0);
    setJDPortalTarget(null);
  }

  function handleGoToAssessment() {
    router.push('/assessment/create');
  }

  function handleStay() {
    setShowSuccessModal(false);
  }

  var currentQuestion = ROLE_CREATION_QUESTIONS[questionIndex] || null;
  var allQuestionsAnswered = questionIndex >= ROLE_CREATION_QUESTIONS.length;
  var isCompact = stage >= 2;

  function handleBack() {
    if (stage === 0) {
      router.push('/roles');
    } else if (stage === 1 && messages.length <= 2) {
      setStage(0);
      setMessages([]);
      setQuestionIndex(0);
      setAnswers({});
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
      {/* Header: Back + Title + Subtitle + Progress */}
      <div style={{ flexShrink: 0, backgroundColor: 'var(--cream)' }}>
        <div style={{ padding: '14px 24px 0' }}>
          <button
            onClick={handleBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: 'var(--brown-soft)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              marginBottom: 10,
            }}
          >
            <ArrowLeft size={13} />
            Back to Roles
          </button>
          <h1 style={{ fontFamily: 'var(--font-body)', fontSize: 18, fontWeight: 600, color: 'var(--brown)', marginBottom: 2 }}>Create a Role</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--brown-soft)', marginBottom: 12 }}>Define a new role and generate a job description</p>
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
                currentQuestion={allQuestionsAnswered ? null : currentQuestion}
                isTyping={isTyping}
                compact={isCompact}
              />
            </div>
          </div>
        )}
      </div>

      {/* JD Canvas rendered into the layout's right panel via portal */}
      {stage >= 2 &&
        jdPortalTarget &&
        createPortal(
          <div className="h-full p-4">
            <JDCanvas
              content={jdContent}
              onChange={setJDContent}
              onSave={handleSaveRole}
              onSaveForLater={handleSaveForLater}
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
