import { useEffect, useState } from 'react';
import { AlertCircle, Award, BookOpen, ChevronRight, Clock, Search } from 'lucide-react';
import type { CourseItem } from '../../pages/Dashboard';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EmptyState, PageHeader } from '../ui/PageHeader';
import { useUiPreferences } from '../../contexts/UiPreferencesContext';

const domains = [
  'All',
  'Statistical Competencies',
  'Technical Competencies',
  'Digital Governance',
  'Behavioural and Managerial Competencies',
];

interface CourseCatalogProps {
  courses: CourseItem[];
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  selectedDomain: string;
  onDomainChange: (value: string) => void;
  courseError: string | null;
  isActionLocked: boolean;
  onSelectCourse: (title: string) => void;
}

export function CourseCatalog({
  courses,
  searchQuery,
  onSearchQueryChange,
  selectedDomain,
  onDomainChange,
  courseError,
  isActionLocked,
  onSelectCourse,
}: CourseCatalogProps) {
  const { t } = useUiPreferences();
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => setVisibleCount(9), [searchQuery, selectedDomain]);
  const visibleCourses = courses.slice(0, visibleCount);

  return (
    <section aria-label="Government course discovery" className="space-y-5">
      <PageHeader
        title={t('catalogTitle')}
        description={t('catalogDescription')}
        actions={
          <Badge variant="neutral">
            {courses.length.toLocaleString('en-IN')}{' '}
            {searchQuery.trim() || selectedDomain !== 'All'
              ? t('catalogMatchingCount')
              : t('catalogTotalCount')}
          </Badge>
        }
      />

      <div className="catalog-toolbar">
        <label className="catalog-search">
          <span className="sr-only">Search courses</span>
          <Search className="h-4 w-4" aria-hidden="true" />
          <input
            type="search"
            name="course-search"
            autoComplete="off"
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder={t('catalogSearchPlaceholder')}
          />
        </label>
        <div className="catalog-filters" aria-label="Course domain filter">
          {domains.map((domain) => (
            <button
              key={domain}
              type="button"
              aria-pressed={selectedDomain === domain}
              onClick={() => onDomainChange(domain)}
              className={selectedDomain === domain ? 'catalog-filter catalog-filter--active' : 'catalog-filter'}
            >
              {domain === 'Behavioural and Managerial Competencies' ? 'Behavioural & managerial' : domain}
            </button>
          ))}
        </div>
      </div>

      {courseError && (
        <div role="status" className="inline-notice">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <span>{courseError}</span>
        </div>
      )}

      {visibleCourses.length > 0 ? (
        <>
          <div className="course-grid">
            {visibleCourses.map((course, index) => {
              const level = course.level ?? course.targetLevel;
              return (
                <article key={course.id || `${course.title}-${index}`} className="course-card cv-auto">
                  <div className="course-card-meta">
                    <Badge variant="neutral">{course.domain || 'Government learning'}</Badge>
                    <span><Clock className="h-3.5 w-3.5" aria-hidden="true" />{course.duration || 'Duration not listed'}</span>
                  </div>
                  <div className="course-card-body">
                    <h2>{course.title}</h2>
                    <p className="course-provider">{course.provider || 'Government of India training provider'}</p>
                    <p>{course.description || 'Course description is available from the provider.'}</p>
                  </div>
                  <div className="course-card-footer">
                    <span className="course-level"><Award className="h-4 w-4" aria-hidden="true" />{level ? `FRAC level ${level}` : 'FRAC aligned'}</span>
                    <Button size="sm" disabled={isActionLocked} onClick={() => onSelectCourse(course.title)}>
                      Create assessment <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
          {visibleCount < courses.length && (
            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={() => setVisibleCount((count) => count + 9)}>
                Show 9 more courses
              </Button>
            </div>
          )}
        </>
      ) : (
        <EmptyState title="No courses match this search" description="Clear the search or choose another domain to browse the available catalog.">
          <Button variant="outline" onClick={() => { onSearchQueryChange(''); onDomainChange('All'); }}>
            <BookOpen className="h-4 w-4" aria-hidden="true" /> Reset filters
          </Button>
        </EmptyState>
      )}
    </section>
  );
}
