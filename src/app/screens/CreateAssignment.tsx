import { useState } from 'react';
import {
  Calendar,
  X,
  Plus,
  Minus,
  Mic,
  ArrowLeft,
  ArrowRight,
  PlusCircle,
  Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { AssignmentAPI } from '../lib/api';
import {
  CreateAssignmentSchema,
  type CreateAssignmentFormData,
} from '../lib/validators';
import { useAssignmentStore } from '../store/assignmentStore';
import UploadZone from '../components/create/UploadZone';
import type { QuestionTypeName } from '../../../packages/shared-types/src/index';

interface QuestionTypeRow {
  id: number;
  type: QuestionTypeName;
  count: number;
  marks: number;
}

const QUESTION_TYPE_OPTIONS: QuestionTypeName[] = [
  'Multiple Choice Questions',
  'Short Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
];

const initialQuestionTypes: QuestionTypeRow[] = [
  { id: 1, type: 'Multiple Choice Questions', count: 4, marks: 1 },
  { id: 2, type: 'Short Questions', count: 3, marks: 2 },
  { id: 3, type: 'Diagram/Graph-Based Questions', count: 5, marks: 5 },
  { id: 4, type: 'Numerical Problems', count: 5, marks: 5 },
];

export default function CreateAssignment() {
  const navigate = useNavigate();
  const { addAssignment } = useAssignmentStore();
  const [questionTypes, setQuestionTypes] =
    useState<QuestionTypeRow[]>(initialQuestionTypes);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFileText, setUploadedFileText] = useState('');
  const [nextId, setNextId] = useState(5);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateAssignmentFormData>({
    resolver: zodResolver(CreateAssignmentSchema),
    defaultValues: {
      title: '',
      subject: '',
      className: '',
      schoolName: '',
      dueDate: '',
      timeAllowed: 60,
      questionTypes: initialQuestionTypes.map((qt) => ({
        type: qt.type,
        count: qt.count,
        marks: qt.marks,
      })),
      additionalInstructions: '',
    },
  });

  const updateQuestionType = (
    id: number,
    field: 'count' | 'marks',
    delta: number
  ) => {
    setQuestionTypes((prev) => {
      const updated = prev.map((qt) =>
        qt.id === id
          ? { ...qt, [field]: Math.max(1, qt[field] + delta) }
          : qt
      );
      // Sync with form
      setValue(
        'questionTypes',
        updated.map((qt) => ({ type: qt.type, count: qt.count, marks: qt.marks }))
      );
      return updated;
    });
  };

  const removeQuestionType = (id: number) => {
    if (questionTypes.length <= 1) {
      toast.error('At least one question type is required');
      return;
    }
    setQuestionTypes((prev) => {
      const updated = prev.filter((qt) => qt.id !== id);
      setValue(
        'questionTypes',
        updated.map((qt) => ({ type: qt.type, count: qt.count, marks: qt.marks }))
      );
      return updated;
    });
  };

  const addQuestionType = () => {
    if (questionTypes.length >= 4) {
      toast.error('Maximum 4 question types allowed');
      return;
    }
    const usedTypes = questionTypes.map((qt) => qt.type);
    const available = QUESTION_TYPE_OPTIONS.find(
      (t) => !usedTypes.includes(t)
    );
    if (!available) {
      toast.error('All question types are already added');
      return;
    }
    const newRow: QuestionTypeRow = {
      id: nextId,
      type: available,
      count: 3,
      marks: 2,
    };
    setNextId((p) => p + 1);
    setQuestionTypes((prev) => {
      const updated = [...prev, newRow];
      setValue(
        'questionTypes',
        updated.map((qt) => ({ type: qt.type, count: qt.count, marks: qt.marks }))
      );
      return updated;
    });
  };

  const totalQuestions = questionTypes.reduce((sum, qt) => sum + qt.count, 0);
  const totalMarks = questionTypes.reduce(
    (sum, qt) => sum + qt.count * qt.marks,
    0
  );

  const onSubmit = async (data: CreateAssignmentFormData) => {
    setIsSubmitting(true);
    try {
      const dto = {
        ...data,
        questionTypes: questionTypes.map((qt) => ({
          type: qt.type,
          count: qt.count,
          marks: qt.marks,
        })),
        ...(uploadedFileText ? { uploadedFileText } : {}),
      };

      const assignment = await AssignmentAPI.create(dto);
      addAssignment(assignment);
      toast.success('Assignment created! Generating paper...');
      navigate(`/question-paper/${assignment._id}`);
    } catch (err: any) {
      const msg =
        err.response?.data?.error?.message ||
        err.response?.data?.error?.details
          ? 'Please fix the form errors'
          : 'Failed to create assignment';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 md:p-6 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: '#22C55E' }}
          />
          <h1
            style={{ fontSize: '20px', fontWeight: '600', color: '#1A1A1A' }}
          >
            Create Assignment
          </h1>
        </div>
        <p style={{ fontSize: '13px', color: '#7A7A7A' }}>
          Set up a new assignment for your students.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8 h-0.5 bg-gray-200 rounded-full relative">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
          style={{ background: '#FF6A3D', width: '33%' }}
        />
        <div
          className="absolute w-3 h-3 rounded-full -top-1.5"
          style={{
            background: '#FF6A3D',
            left: '33%',
            transform: 'translateX(-50%)',
          }}
        />
      </div>

      {/* Main Card */}
      <div
        className="bg-white rounded-2xl p-4 md:p-7 mb-6"
        style={{ border: '1px solid #EAEAEA' }}
      >
        {/* Section Header */}
        <div className="mb-6">
          <h2
            style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#1A1A1A',
              marginBottom: '4px',
            }}
          >
            Assignment Details
          </h2>
          <p style={{ fontSize: '13px', color: '#7A7A7A' }}>
            Basic information about your assignment
          </p>
        </div>

        {/* Upload Dropzone */}
        <UploadZone onTextExtracted={setUploadedFileText} />

        {/* Title */}
        <div className="mb-4">
          <label
            style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#1A1A1A',
              marginBottom: '6px',
              display: 'block',
            }}
          >
            Assignment Title *
          </label>
          <input
            {...register('title')}
            type="text"
            placeholder="e.g. Quiz on Electricity"
            className="w-full h-10 px-3 rounded-lg bg-transparent outline-none"
            style={{
              border: errors.title ? '1px solid #EF4444' : '1px solid #EAEAEA',
              fontSize: '14px',
            }}
          />
          {errors.title && (
            <p style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}>
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Subject & Class Row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label
              style={{
                fontSize: '13px',
                fontWeight: '500',
                color: '#1A1A1A',
                marginBottom: '6px',
                display: 'block',
              }}
            >
              Subject *
            </label>
            <input
              {...register('subject')}
              type="text"
              placeholder="e.g. Science"
              className="w-full h-10 px-3 rounded-lg bg-transparent outline-none"
              style={{
                border: errors.subject
                  ? '1px solid #EF4444'
                  : '1px solid #EAEAEA',
                fontSize: '14px',
              }}
            />
            {errors.subject && (
              <p
                style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}
              >
                {errors.subject.message}
              </p>
            )}
          </div>
          <div>
            <label
              style={{
                fontSize: '13px',
                fontWeight: '500',
                color: '#1A1A1A',
                marginBottom: '6px',
                display: 'block',
              }}
            >
              Class *
            </label>
            <input
              {...register('className')}
              type="text"
              placeholder="e.g. 8th"
              className="w-full h-10 px-3 rounded-lg bg-transparent outline-none"
              style={{
                border: errors.className
                  ? '1px solid #EF4444'
                  : '1px solid #EAEAEA',
                fontSize: '14px',
              }}
            />
            {errors.className && (
              <p
                style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}
              >
                {errors.className.message}
              </p>
            )}
          </div>
        </div>

        {/* School Name & Time Row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label
              style={{
                fontSize: '13px',
                fontWeight: '500',
                color: '#1A1A1A',
                marginBottom: '6px',
                display: 'block',
              }}
            >
              School Name *
            </label>
            <input
              {...register('schoolName')}
              type="text"
              placeholder="e.g. Delhi Public School"
              className="w-full h-10 px-3 rounded-lg bg-transparent outline-none"
              style={{
                border: errors.schoolName
                  ? '1px solid #EF4444'
                  : '1px solid #EAEAEA',
                fontSize: '14px',
              }}
            />
            {errors.schoolName && (
              <p
                style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}
              >
                {errors.schoolName.message}
              </p>
            )}
          </div>
          <div>
            <label
              style={{
                fontSize: '13px',
                fontWeight: '500',
                color: '#1A1A1A',
                marginBottom: '6px',
                display: 'block',
              }}
            >
              Time Allowed (minutes) *
            </label>
            <input
              {...register('timeAllowed', { valueAsNumber: true })}
              type="number"
              min={15}
              max={300}
              placeholder="60"
              className="w-full h-10 px-3 rounded-lg bg-transparent outline-none"
              style={{
                border: errors.timeAllowed
                  ? '1px solid #EF4444'
                  : '1px solid #EAEAEA',
                fontSize: '14px',
              }}
            />
            {errors.timeAllowed && (
              <p
                style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}
              >
                {errors.timeAllowed.message}
              </p>
            )}
          </div>
        </div>

        {/* Due Date */}
        <div className="mb-6">
          <label
            style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#1A1A1A',
              marginBottom: '6px',
              display: 'block',
            }}
          >
            Due Date *
          </label>
          <div
            className="h-10 px-3 rounded-lg flex items-center justify-between"
            style={{
              border: errors.dueDate
                ? '1px solid #EF4444'
                : '1px solid #EAEAEA',
            }}
          >
            <input
              {...register('dueDate')}
              type="date"
              min={new Date().toISOString().split('T')[0]}
              className="flex-1 bg-transparent border-none outline-none"
              style={{ fontSize: '14px' }}
            />
            <Calendar size={16} style={{ color: '#9CA3AF' }} />
          </div>
          {errors.dueDate && (
            <p style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}>
              {errors.dueDate.message}
            </p>
          )}
        </div>

        {/* Question Type Section */}
        <div className="mb-6">
          <div className="grid grid-cols-12 gap-3 mb-3">
            <div
              className="col-span-6"
              style={{
                fontSize: '13px',
                fontWeight: '500',
                color: '#1A1A1A',
              }}
            >
              Question Type
            </div>
            <div
              className="col-span-3"
              style={{
                fontSize: '13px',
                fontWeight: '500',
                color: '#1A1A1A',
              }}
            >
              No. of Questions
            </div>
            <div
              className="col-span-3"
              style={{
                fontSize: '13px',
                fontWeight: '500',
                color: '#1A1A1A',
              }}
            >
              Marks
            </div>
          </div>

          {questionTypes.map((qt) => (
            <div key={qt.id} className="grid grid-cols-12 gap-3 mb-3">
              <div className="col-span-6">
                <div
                  className="h-10 px-3 rounded-lg flex items-center justify-between"
                  style={{ border: '1px solid #EAEAEA' }}
                >
                  <span style={{ fontSize: '13px', color: '#1A1A1A' }}>
                    {qt.type}
                  </span>
                  <button type="button" onClick={() => removeQuestionType(qt.id)}>
                    <X size={16} style={{ color: '#9CA3AF' }} />
                  </button>
                </div>
              </div>
              <div className="col-span-3">
                <div
                  className="h-10 rounded-lg flex items-center justify-between px-2"
                  style={{ border: '1px solid #EAEAEA' }}
                >
                  <button
                    type="button"
                    onClick={() => updateQuestionType(qt.id, 'count', -1)}
                  >
                    <Minus size={14} style={{ color: '#1A1A1A' }} />
                  </button>
                  <span style={{ fontSize: '14px', color: '#1A1A1A' }}>
                    {qt.count}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuestionType(qt.id, 'count', 1)}
                  >
                    <Plus size={14} style={{ color: '#1A1A1A' }} />
                  </button>
                </div>
              </div>
              <div className="col-span-3">
                <div
                  className="h-10 rounded-lg flex items-center justify-between px-2"
                  style={{ border: '1px solid #EAEAEA' }}
                >
                  <button
                    type="button"
                    onClick={() => updateQuestionType(qt.id, 'marks', -1)}
                  >
                    <Minus size={14} style={{ color: '#1A1A1A' }} />
                  </button>
                  <span style={{ fontSize: '14px', color: '#1A1A1A' }}>
                    {qt.marks}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuestionType(qt.id, 'marks', 1)}
                  >
                    <Plus size={14} style={{ color: '#1A1A1A' }} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {errors.questionTypes && (
            <p style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}>
              {errors.questionTypes.message || 'Invalid question configuration'}
            </p>
          )}

          <button
            type="button"
            onClick={addQuestionType}
            className="flex items-center gap-2 mt-3 hover:opacity-70 transition-opacity"
          >
            <PlusCircle size={16} style={{ color: '#1A1A1A' }} />
            <span style={{ fontSize: '14px', color: '#1A1A1A' }}>
              Add Question Type
            </span>
          </button>
        </div>

        {/* Totals */}
        <div className="flex justify-end gap-6 mb-6">
          <div
            className="px-3 py-1.5 rounded-lg"
            style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#1A1A1A',
              background: '#F3F4F6',
            }}
          >
            Total Questions : {totalQuestions}
          </div>
          <div
            className="px-3 py-1.5 rounded-lg"
            style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#1A1A1A',
              background: '#F3F4F6',
            }}
          >
            Total Marks : {totalMarks}
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <label
            style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#1A1A1A',
              marginBottom: '6px',
              display: 'block',
            }}
          >
            Additional Information (For better output)
          </label>
          <div className="relative">
            <textarea
              {...register('additionalInstructions')}
              placeholder="e.g Generate a question paper for 3 hour exam duration..."
              className="w-full rounded-lg px-3 py-3 resize-none"
              style={{
                border: '1px solid #EAEAEA',
                fontSize: '14px',
                minHeight: '80px',
              }}
            />
            <button type="button" className="absolute bottom-3 right-3">
              <Mic size={16} style={{ color: '#9CA3AF' }} />
            </button>
          </div>
          {errors.additionalInstructions && (
            <p style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}>
              {errors.additionalInstructions.message}
            </p>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-10 px-6 rounded-lg flex items-center gap-2"
          style={{
            border: '1px solid #EAEAEA',
            background: 'white',
            fontSize: '14px',
            fontWeight: '500',
            color: '#1A1A1A',
          }}
        >
          <ArrowLeft size={16} />
          <span>Previous</span>
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-10 px-6 rounded-lg flex items-center gap-2 transition-opacity"
          style={{
            background: '#111111',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: '500',
            opacity: isSubmitting ? 0.6 : 1,
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <span>Generate Paper</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
