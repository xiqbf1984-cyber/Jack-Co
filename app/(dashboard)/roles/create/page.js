'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useAppStore } from '@/stores/app-store';
import { ROLE_CREATION_QUESTIONS } from '@/lib/constants';
import SearchPage from '@/components/role-creation/search-page';
import ChatPanel from '@/components/role-creation/chat-panel';
import JDCanvas from '@/components/role-creation/jd-canvas';

const STAGES = [
  { key: 'describe', label: 'Describe' },
  { key: 'refine', label: 'Refine' },
  { key: 'jd-ready', label: 'JD Ready' },
];

function generateJD(answers) {
  const title = answers.title || 'Open Role';
  const ownership = answers.own || 'key responsibilities';
  const skills = answers.skills || 'relevant technical skills';
  const level = answers.level || 'Mid-Senior';
  const extras = answers.extra || '';

  return `${title}

About the Role
We are looking for a ${level}-level ${title} to join our team. This person will own ${ownership} and play a critical role in driving our technical vision forward.

Responsibilities
- Lead and own ${ownership} across the organization
- Collaborate with cross-functional teams to define technical strategy
- Mentor junior engineers and contribute to engineering culture
- Drive improvements in system reliability, performance, and scalability
- Participate in architectural decisions and code reviews

Requirements
- Strong experience with ${skills}
- ${level} level experience in a relevant domain
- Excellent problem-solving and communication skills
- Track record of shipping production-quality software
- Ability to work independently and lead technical initiatives

Nice to Have
- Experience in fast-paced startup environments
- Open-source contributions
- Published research or technical writing

${extras ? `Additional Details\n${extras}` : ''}

We offer competitive compensation, flexible work arrangements, and the opportunity to work on cutting-edge technology with a world-class team.`.trim();
}

function ProgressIndicator({ currentStage }) {
  return (
    <div className="flex items-center justify-center gap-0 py-4 px-6">
      {STAGES.map((stage, i) => {
        const isCurrent = i === currentStage;
        const isDone = i < currentStage;
        const isFuture = i > currentStage;

        return (
          <div key={stage.key} className="flex items-center">
            {/* Dot + Label */}
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-3 h-3 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: isDone
                    ? 'var(--accent-green)'
                    : isCurrent
                    ? 'var(--gold)'
                    : 'var(--border-default)',
                  boxShadow: isCurrent
                    ? '0 0 0 4px rgba(139, 105, 20, 0.15)'
                    : 'none',
                }}
              />
              <span
                className="text-body-xs font-medium whitespace-nowrap"
                style={{
                  color: isDone
                    ? 'var(--accent-green)'
                    : isCurrent
                    ? 'var(--gold)'
                    : 'var(--brown-soft)',
                }}
              >
                {stage.label}
              </span>
            </div>

            {/* Connecting line */}
            {i < STAGES.length - 1 && (
              <div
                className="w-16 mx-2 transition-colors duration-300"
                style={{
                  height: 2,
                  marginTop: -14,
                  backgroundColor: isDone
                    ? 'var(--accent-green)'
                    : 'var(--border-default)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function RoleCreatePage() {
  const router = useRouter();
  const addRole = useAppStore((s) => s.addRole);

  const [stage, setStage] = useState(0); // 0=describe, 1=refine, 2=jd-ready
  const [messages, setMessages] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [answers, setAnswers] = useState({});
  const [jdContent, setJDContent] = useState('');
  const [jdPortalTarget, setJDPortalTarget] = useState(null);
  const [description, setDescription] = useState('');

  // Watch for the portal target element
  useEffect(() => {
    if (stage < 2) return;
    const check = () => {
      const el = document.getElementById('jd-canvas-panel');
      if (el) setJDPortalTarget(el);
    };
    check();
    const timer = setInterval(check, 100);
    return () => clearInterval(timer);
  }, [stage]);

  // Toggle right panel visibility via custom event
  useEffect(() => {
    if (stage >= 2) {
      window.dispatchEvent(
        new CustomEvent('jd-panel-toggle', { detail: { visible: true } })
      );
    }
    return () => {
      window.dispatchEvent(
        new CustomEvent('jd-panel-toggle', { detail: { visible: false } })
      );
    };
  }, [stage]);

  const addAIMessage = useCallback(
    (content) => {
      setIsTyping(true);
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: 'ai', content }]);
        setIsTyping(false);
      }, 800);
    },
    []
  );

  // Handle initial search submit
  function handleSearchSubmit(text) {
    setDescription(text);
    setStage(1);
    // Add the user's description as first message, then AI asks Q1
    setMessages([{ role: 'user', content: text }]);
    addAIMessage(
      `Great, I'll help you build this role. ${ROLE_CREATION_QUESTIONS[0].question}`
    );
  }

  // Handle chat message send
  function handleChatSend(text) {
    // Record answer
    const currentQ = ROLE_CREATION_QUESTIONS[questionIndex];
    const newAnswers = { ...answers, [currentQ.id]: text };
    setAnswers(newAnswers);

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: text }]);

    const nextIndex = questionIndex + 1;

    // After question index 2 (3rd question answered), show JD panel
    if (nextIndex >= 3 && stage < 2) {
      setStage(2);
      const jd = generateJD(newAnswers);
      setJDContent(jd);
    }

    setQuestionIndex(nextIndex);

    if (nextIndex < ROLE_CREATION_QUESTIONS.length) {
      // If we already have a JD, update it with new answers
      if (nextIndex >= 3) {
        const updatedJD = generateJD(newAnswers);
        setJDContent(updatedJD);
      }

      addAIMessage(ROLE_CREATION_QUESTIONS[nextIndex].question);
    } else {
      // All questions answered
      const finalJD = generateJD(newAnswers);
      setJDContent(finalJD);
      addAIMessage(
        "Your job description is ready! Review and edit it on the right, then click 'Save Role' when you're satisfied."
      );
    }
  }

  // Handle JD save
  function handleSaveRole() {
    const title = answers.title || description.slice(0, 40);
    addRole({
      title,
      dept: answers.own || 'Engineering',
      salary: answers.extra || 'Competitive',
      status: 'draft',
      jd: jdContent,
    });
    router.push('/roles/create/complete?title=' + encodeURIComponent(title));
  }

  const currentQuestion = ROLE_CREATION_QUESTIONS[questionIndex] || null;
  const allQuestionsAnswered = questionIndex >= ROLE_CREATION_QUESTIONS.length;

  return (
    <div className="flex flex-col h-full">
      <ProgressIndicator currentStage={stage} />

      <div className="flex-1 overflow-hidden">
        {stage === 0 && <SearchPage onSubmit={handleSearchSubmit} />}

        {stage >= 1 && (
          <ChatPanel
            messages={messages}
            onSend={handleChatSend}
            currentQuestion={allQuestionsAnswered ? null : currentQuestion}
            isTyping={isTyping}
          />
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
              onSave={allQuestionsAnswered ? handleSaveRole : undefined}
            />
          </div>,
          jdPortalTarget
        )}
    </div>
  );
}
