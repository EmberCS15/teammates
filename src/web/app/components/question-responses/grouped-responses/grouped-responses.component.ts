import { Component, Input, OnInit } from '@angular/core';
import {
  FeedbackSession, FeedbackSessionPublishStatus, FeedbackSessionSubmissionStatus,
  QuestionOutput, ResponseOutput,
  ResponseVisibleSetting,
  SessionVisibleSetting,
} from '../../../../types/api-output';
import { CommentRowMode } from '../../comment-box/comment-row/comment-row.component';
import { CommentTableModel } from '../../comment-box/comment-table/comment-table.component';
import { InstructorResponsesViewBase } from '../instructor-responses-view-base';

/**
 * A list of responses grouped in GRQ/RGQ mode.
 */
@Component({
  selector: 'tm-grouped-responses',
  templateUrl: './grouped-responses.component.html',
  styleUrls: ['./grouped-responses.component.scss'],
})
export class GroupedResponsesComponent extends InstructorResponsesViewBase implements OnInit {

  // enum
  CommentRowMode: typeof CommentRowMode = CommentRowMode;

  @Input() responses: QuestionOutput[] = [];
  @Input() userToEmail: Record<string, string> = {};

  @Input() isLastGroupedResponses: boolean = false;
  @Input() isGrq: boolean = true;
  @Input() session: FeedbackSession = {
    courseId: '',
    timeZone: '',
    feedbackSessionName: '',
    instructions: '',
    submissionStartTimestamp: 0,
    submissionEndTimestamp: 0,
    gracePeriod: 0,
    sessionVisibleSetting: SessionVisibleSetting.AT_OPEN,
    responseVisibleSetting: ResponseVisibleSetting.AT_VISIBLE,
    submissionStatus: FeedbackSessionSubmissionStatus.OPEN,
    publishStatus: FeedbackSessionPublishStatus.NOT_PUBLISHED,
    isClosingEmailEnabled: true,
    isPublishedEmailEnabled: true,
    createdAtTimestamp: 0,
  };

  hasRealResponses: boolean = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.hasRealResponses = this.responses.some((question: QuestionOutput) =>
        question.allResponses.some((response: ResponseOutput) => !response.isMissingResponse));
  }

  get teamInfo(): Record<string, string> {
    const team: Record<string, string> = {};
    let recipientTeamName = this.responses[0].allResponses[0].recipientTeam;
    if (recipientTeamName != '') {
      team.recipient = (recipientTeamName === '-') ? '(No Specific Team)' : `(${recipientTeamName})`;
    } else {
      team.recipient = '';
    }
    team.giver = `(${this.responses[0].allResponses[0].giverTeam})`;
    return team;
  }

  toggleAddComment(responseId: string): void {
    const commentTable: CommentTableModel = this.instructorCommentTableModel[responseId];
    commentTable.isAddingNewComment = !commentTable.isAddingNewComment;
    this.triggerModelChangeForSingleResponse(responseId, commentTable);
  }

}
