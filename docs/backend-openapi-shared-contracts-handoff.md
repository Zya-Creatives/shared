# Backend OpenAPI Shared Contracts Handoff

Shared now exports the backend OpenAPI request/response contracts that were previously defined locally in backend route files. After publishing this package, update the backend dependency and replace the local schemas with top-level imports from `@zyacreatives/shared`.

## Publish Target

- Package: `@zyacreatives/shared`
- Current source version: `2.5.79`
- Import style: prefer `@zyacreatives/shared` over deep imports such as `@zyacreatives/shared/dist/schemas/comment`.

## Highest Priority Replacements

### User Purchase Library

Backend sources:
- `src/api/user/user.openapi.ts`
- `src/api/transaction/transaction.services.ts`

Shared exports:
- `PurchaseLibraryInputSchema`
- `PurchaseLibraryItemSchema`
- `PurchaseLibraryOutputSchema`
- `type PurchaseLibraryInput`
- `type PurchaseLibraryItem`
- `type PurchaseLibraryOutput`

Backend migration notes:
- Replace the local OpenAPI schemas in `user.openapi.ts`.
- Remove duplicated `PurchaseLibraryItem` / purchase result service types in `transaction.services.ts` and infer/use the shared types instead.

### Chat Reports And Chat List Query

Backend source:
- `src/api/chat/chat.openapi.ts`

Shared exports:
- `ReportChatInputSchema`
- `ReportChatOutputSchema`
- `ChatListQuerySchema`
- `type ReportChatInput`
- `type ReportChatOutput`
- `type ChatListQuery`

### Job Dashboard / Application Status Outputs

Backend sources:
- `src/api/job/job.openapi.ts`
- `src/entity/job.entity.ts`

Shared exports:
- `NormalizedJobSchema`
- `type NormalizedJob`
- `GetCreatedJobsOutputSchema`
- `GetApplicationStatusUpdatesCountOutputSchema`
- `JobApplicationIdInputSchema`
- `GetApplicationsForJobOutputSchema`

Backend migration notes:
- Use shared `NormalizedJobSchema` for OpenAPI responses.
- `NormalizedJobSchema` remains compatible with the existing shared job entity schemas.
- `JobApplicationIdInputSchema` uses `{ applicationId: string }` for the path param.

### Comment Threads And Replies

Backend sources:
- `src/api/comment/comment.openapi.ts`
- `src/api/project/project.openapi.ts`

Shared exports:
- `CommentThreadResponseSchema`
- `CommentRepliesOutputSchema`
- `CommentIdInputSchema`
- `ProjectCommentParamsSchema`

Backend migration notes:
- Replace deep `CommentEntitySchema` imports with top-level imports from `@zyacreatives/shared`.

### Payout Method Utility Inputs

Backend source:
- `src/api/payout-method/payout-method.openapi.ts`

Shared exports:
- `GetBanksInputSchema`
- `VerifyAccountInputSchema`
- `type GetBanksInput`
- `type VerifyAccountInput`

## Medium Priority Replacements

### User Auth / Mentions / Feed Preferences

Backend source:
- `src/api/user/user.openapi.ts`

Shared exports:
- `UserAuthStatusEntitySchema`
- `DeactivateAccountInputSchema`
- `MentionableUsersInputSchema`
- `MentionableUsersOutputSchema`
- `UserWithJobBookmarksInputSchema`
- `FeedTagsInputSchema`
- `FeedTagsSchema`

### Feed Variant Output

Backend source:
- `src/api/feed/feed.openapi.ts`

Shared export:
- `GetFeedWithCommentPolicyOutputSchema`

Note:
- If this is now the canonical feed response, consider replacing or aliasing backend usage of any older local feed output schema.

### Messages Delete And Params

Backend sources:
- `src/api/message/message.openapi.ts`
- `src/api/message/message.services.ts`

Shared exports:
- `ChatIdParamSchema`
- `MessageParamsSchema`
- `DeleteMessagesInputSchema`
- `type DeleteMessagesInput`

### Investor Signal / Shortlist Checks

Backend sources:
- `src/api/investor-signal/investor-signal.openapi.ts`
- `src/api/investor-shortlist-item/investor-shortlist-item.openapi.ts`

Shared exports:
- `CheckInvestorSignalOutputSchema`
- `CheckInvestorShortlistItemOutputSchema`
- `InvestorSignalIdInputSchema`
- `InvestorShortlistItemIdInputSchema`
- `DefaultApiSuccessOutputSchema`

### File Route Params And JSend URL Response

Backend source:
- `src/api/file/file.openapi.ts`

Shared exports:
- `PurchasedDownloadUrlInputSchema`
- `PublicFileUrlInputSchema`
- `PresignedUrlJSendOutputSchema`

## Low Priority / Primitive Replacements

### Entity Id Params

Backend sources:
- `src/api/product/product.openapi.ts`
- `src/api/transaction/transaction.openapi.ts`
- `src/api/job/job.openapi.ts`
- inline investor module params

Shared exports:
- `ProductIdInputSchema`
- `TransactionIdInputSchema`
- `JobIdSchema`
- `ApplicationIdInputSchema`
- `IdInputSchema`

### Discipline Tags Query

Backend source:
- `src/api/discipline/discipline.openapi.ts`

Shared exports:
- `GetDisciplineTagsInputSchema`
- `GetDisciplineTagsOutputSchema`

## Suggested Backend Migration Order

1. Update `@zyacreatives/shared` in backend `package.json` after publishing.
2. Replace local OpenAPI schemas listed above with top-level shared imports.
3. Remove duplicated service-level types where shared now exports matching types.
4. Replace deep shared imports with top-level `@zyacreatives/shared` imports.
5. Regenerate OpenAPI output.
6. Run backend typecheck and route/OpenAPI tests.

## Verification Completed In Shared

The shared package typechecks successfully with:

```sh
pnpm.cmd tsc
```

